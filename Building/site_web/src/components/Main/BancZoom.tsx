export function BancZoom(props) {
    return (<div>
        <div className="zoomTitle"><b>Etat de santé des composants de l'engrenage principal</b></div>
        <div className="zoomImage">
            <img style={{
                width: "100%",
                height: "auto"
            }} src={"assets/images/" + props.zoomEngrenagePicture + "-Split001.jpg"} useMap="#image-map2" />


            <map name="image-map2">
                <area onMouseEnter={() => props.setTitle("Engrenage-Pignon")} onClick={props.handleClickArea} id="Engrenage-Pignon" href="#" coords="327,302,266,247,121,316,119,378,6,437,24,483,144,435,188,467,221,459,221,359" shape="poly" />
                <area onMouseEnter={() => props.setTitle("Engrenage-Roue")} onClick={props.handleClickArea} id="Engrenage-Roue" href="#" coords="451,314,347,363,346,463,463,595,558,545,568,455,637,407,593,351,539,374" shape="poly" />

            </map>
        </div>

    </div>);
}
