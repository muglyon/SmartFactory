using System.Collections;
using System.Linq;
using RosMessageTypes.Geometry;
using RosMessageTypes.NiryoMoveit;
using UnityEngine;

using ROSGeometry;
using Quaternion = UnityEngine.Quaternion;
using RosImage = RosMessageTypes.Sensor.Image;
using Transform = UnityEngine.Transform;
using Vector3 = UnityEngine.Vector3;


public class GotoPlanner : MonoBehaviour
{
    // ROS Connector
    private ROSConnection ros;

    // Hardcoded variables 
    private int numRobotJoints = 6;
    private readonly float jointAssignmentWait = 0.1f;
    private readonly float poseAssignmentWait = 0.5f;
    private readonly Vector3 pickPoseOffset = Vector3.up * 0.1f;

    // Assures that the gripper is always positioned above the target cube before grasping.
    private readonly Quaternion pickOrientation = Quaternion.Euler(90, 90, 0);

    // Variables required for ROS communication
    public string rosServiceName = "niryo_moveit";

    public GameObject niryoOne;
    public GameObject target;

    public float targetX = 0;
    public float targetY = 0;
    public float targetZ = 0;
    // Articulation Bodies
    private ArticulationBody[] jointArticulationBodies;
    private ArticulationBody leftGripper;
    private ArticulationBody rightGripper;

    private Transform gripperBase;
    private Transform leftGripperGameObject;
    private Transform rightGripperGameObject;

    private enum Poses
    {
        PreGrasp,
        Grasp,
        PickUp,
        Place
    };

    /// <summary>
    ///     Close the gripper
    /// </summary>
    private void CloseGripper()
    {
        var leftDrive = leftGripper.xDrive;
        var rightDrive = rightGripper.xDrive;

        leftDrive.target = -0.01f;
        rightDrive.target = 0.01f;

        leftGripper.xDrive = leftDrive;
        rightGripper.xDrive = rightDrive;
    }

    /// <summary>
    ///     Open the gripper
    /// </summary>
    private void OpenGripper()
    {
        var leftDrive = leftGripper.xDrive;
        var rightDrive = rightGripper.xDrive;

        leftDrive.target = 0.01f;
        rightDrive.target = -0.01f;

        leftGripper.xDrive = leftDrive;
        rightGripper.xDrive = rightDrive;
    }

    /// <summary>
    ///     Get the current values of the robot's joint angles.
    /// </summary>
    /// <returns>NiryoMoveitJoints</returns>
    NiryoMoveitJoints CurrentJointConfig()
    {
        NiryoMoveitJoints joints = new NiryoMoveitJoints();

        joints.joint_00 = jointArticulationBodies[0].xDrive.target;
        joints.joint_01 = jointArticulationBodies[1].xDrive.target;
        joints.joint_02 = jointArticulationBodies[2].xDrive.target;
        joints.joint_03 = jointArticulationBodies[3].xDrive.target;
        joints.joint_04 = jointArticulationBodies[4].xDrive.target;
        joints.joint_05 = jointArticulationBodies[5].xDrive.target;

        return joints;
    }

    /// <summary>
    ///     Create a new MoverServiceRequest with the current values of the robot's joint angles,
    ///     the target cube's current position and rotation, and the targetPlacement position and rotation.
    ///
    ///     Call the MoverService using the ROSConnection and if a trajectory is successfully planned,
    ///     execute the trajectories in a coroutine.
    /// </summary>
    public void PublishJoints()
    {
        GotoServiceRequest request = new GotoServiceRequest();
        request.joints_input = CurrentJointConfig();

        if(targetX == 0 && targetY == 0 && targetZ == 0)
        {
            request.target_pose = new RosMessageTypes.Geometry.Pose
            {
                position = (target.transform.position + pickPoseOffset).To<FLU>(),
                // The hardcoded x/z angles assure that the gripper is always positioned above the target cube before grasping.
                orientation = Quaternion.Euler(90, target.transform.eulerAngles.y, 0).To<FLU>()
            };
        } else
        {
            float Xpose = targetX * 0.3f;
            float Ypose = (targetY * 0.15f) + 0.75f;
            float Zpose = targetZ * 0.225f;

            request.target_pose = new RosMessageTypes.Geometry.Pose
            {
                position = (new Vector3(Xpose, Ypose, Zpose) + pickPoseOffset).To<FLU>(),
                // The hardcoded x/z angles assure that the gripper is always positioned above the target cube before grasping.
                orientation = Quaternion.Euler(90, target.transform.eulerAngles.y, 0).To<FLU>()
            };
        }
        // Pick Pose


        ros.SendServiceMessage<GotoServiceResponse>(rosServiceName, request, TrajectoryResponse);
    }

    void TrajectoryResponse(GotoServiceResponse response)
    {
        if (response.trajectories.Length > 0)
        {
            Debug.Log("Trajectory returned.");
            StartCoroutine(ExecuteTrajectories(response));
        }
        else
        {
            Debug.LogError("No trajectory returned from GotoService.");
        }
    }

    /// <summary>
    ///     Execute the returned trajectories from the MoverService.
    ///
    ///     The expectation is that the MoverService will return four trajectory plans,
    ///         PreGrasp, Grasp, PickUp, and Place,
    ///     where each plan is an array of robot poses. A robot pose is the joint angle values
    ///     of the six robot joints.
    ///
    ///     Executing a single trajectory will iterate through every robot pose in the array while updating the
    ///     joint values on the robot.
    /// 
    /// </summary>
    /// <param name="response"> MoverServiceResponse received from niryo_moveit mover service running in ROS</param>
    /// <returns></returns>
    private IEnumerator ExecuteTrajectories(GotoServiceResponse response)
    {
        if (response.trajectories != null)
        {
            // For every trajectory plan returned
            for (int poseIndex = 0; poseIndex < response.trajectories.Length; poseIndex++)
            {
                // For every robot pose in trajectory plan
                for (int jointConfigIndex = 0; jointConfigIndex < response.trajectories[poseIndex].joint_trajectory.points.Length; jointConfigIndex++)
                {
                    var jointPositions = response.trajectories[poseIndex].joint_trajectory.points[jointConfigIndex].positions;
                    float[] result = jointPositions.Select(r => (float)r * Mathf.Rad2Deg).ToArray();

                    // Set the joint values for every joint
                    for (int joint = 0; joint < jointArticulationBodies.Length; joint++)
                    {
                        var joint1XDrive = jointArticulationBodies[joint].xDrive;
                        joint1XDrive.target = result[joint];
                        jointArticulationBodies[joint].xDrive = joint1XDrive;
                    }
                    // Wait for robot to achieve pose for all joint assignments
                    yield return new WaitForSeconds(jointAssignmentWait);
                }

                // Close the gripper if completed executing the trajectory for the Grasp pose
                if (poseIndex == (int)Poses.Grasp)
                    CloseGripper();

                // Wait for the robot to achieve the final pose from joint assignment
                yield return new WaitForSeconds(poseAssignmentWait);
            }
            // All trajectories have been executed, open the gripper to place the target cube
            OpenGripper();
        }
    }

    /// <summary>
    ///     Find all robot joints in Awake() and add them to the jointArticulationBodies array.
    ///     Find left and right finger joints and assign them to their respective articulation body objects.
    /// </summary>
    void Start()
    {
        // Get ROS connection static instance
        ros = ROSConnection.instance;

        jointArticulationBodies = new ArticulationBody[numRobotJoints];
        string shoulder_link = "world/base_link/shoulder_link";
        jointArticulationBodies[0] = niryoOne.transform.Find(shoulder_link).GetComponent<ArticulationBody>();

        string arm_link = shoulder_link + "/arm_link";
        jointArticulationBodies[1] = niryoOne.transform.Find(arm_link).GetComponent<ArticulationBody>();

        string elbow_link = arm_link + "/elbow_link";
        jointArticulationBodies[2] = niryoOne.transform.Find(elbow_link).GetComponent<ArticulationBody>();

        string forearm_link = elbow_link + "/forearm_link";
        jointArticulationBodies[3] = niryoOne.transform.Find(forearm_link).GetComponent<ArticulationBody>();

        string wrist_link = forearm_link + "/wrist_link";
        jointArticulationBodies[4] = niryoOne.transform.Find(wrist_link).GetComponent<ArticulationBody>();

        string hand_link = wrist_link + "/hand_link";
        jointArticulationBodies[5] = niryoOne.transform.Find(hand_link).GetComponent<ArticulationBody>();

        // Find left and right fingers
        string right_gripper = hand_link + "/tool_link/gripper_base/servo_head/control_rod_right/right_gripper";
        string left_gripper = hand_link + "/tool_link/gripper_base/servo_head/control_rod_left/left_gripper";
        string gripper_base = hand_link + "/tool_link/gripper_base/Collisions/unnamed";

        gripperBase = niryoOne.transform.Find(gripper_base);
        leftGripperGameObject = niryoOne.transform.Find(left_gripper);
        rightGripperGameObject = niryoOne.transform.Find(right_gripper);

        rightGripper = rightGripperGameObject.GetComponent<ArticulationBody>();
        leftGripper = leftGripperGameObject.GetComponent<ArticulationBody>();
    }
}