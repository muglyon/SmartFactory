import FluideCoupe from "./Graph/FluideCoupe";
import ViscoTempGraph from "./Graph/ViscoTempGraph";

export default function Huile(props) {
    // const router = useRouter();
    // const dispatch = useDispatch();


    // const huile = useSelector<GlobalState, string>((state) => state.datas.huile);

    return <div>
        <FluideCoupe />
        <ViscoTempGraph/>
    </div>
}