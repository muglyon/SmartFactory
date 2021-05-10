interface IElementsIndicatorMap {
    [key: string]: string[];
}

const elementsIndicatorMap: IElementsIndicatorMap = {
    "Roulement Principal": [
        "OCSVM global",
        "Accel_Rad_R_RMS",
        "Accel_Rad_R_HFFT_[4-6]KHz",
        "Accel_Rad_R_HFFT_[0-100]",
    ],
    "Engrenage Principal": [
        "OCSVM global",
        "Accel_Axial_RMS",
        "V_RMS_Axial_[2_1000]Hz",
        "V_RMS_Axial_[700_900]Hz",
        "Accel_Rad_RMS",
        "V_RMS_Rad_[2_1000]Hz",
        "V_RMS_Rad_[700_900]Hz",
        "OCSVM engrenage",
    ],
    "Génératrice": [
        "OCSVM global",
        "Courant_RMS",
    ],
    "Engrenage-Pignon": [
        "OCSVM global",
        "Accel_Axial_ordre1+2+3",
        "Accel_Axial_Hfft_ordre1+2+3",
        "Courant_Hfft_ordre1+2+3",
        "Accel_Rad_ordre1+2+3",
        "Accel_Rad_Hfft_ordre1+2+3"
    ],
    "Engrenage-Roue": [
        "OCSVM global",
        "Accel_Axial_ordre0.3+0.6+0.9",
        "Accel_Axial_Hfft_ordre0.3+0.6+0.9",
        "Courant_Hfft_ordre0.3+0.6+0.9",
        "Accel_Rad_ordre0.3+0.6+0.9",
        "Accel_Rad_Hfft_ordre0.3+0.6+0.9",
    ]
};

export default elementsIndicatorMap;