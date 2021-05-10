import { Checkbox, FormControlLabel } from '@material-ui/core';
import '../src/styles/predict.scss'

const formules = () => {

    return <div className="card p-4" style={{ textAlign: "left" }}>
        <h1>Formules utilisées </h1>

        <div>
            Luminosité :
            <ul>
                <li>Si salle vide : volume de la pièce * 100 lumens</li>

                <li>Sinon : volume de la pièce * 300 lumens</li>
            </ul>

        </div>
        <br />
        <br />
        <div>
            Consommation :
            <ul>
                <li>Escalator: (2000W + variable aléatoire) * hauteur du hall (numéro de l'étage)</li>

                <li>Climatisation : 35W * volume de la pièce</li>


                <li>Luminosité : On considère que 1000 lumens consomment 65W. Produit en croix : nbLumens * 65 / 1000</li>
            </ul>
        </div>

        <br />
        <br />

        <h1>Seuils d'alertes</h1>
        <div>
            Alertes :
            <ul> 
                <li>
                    <FormControlLabel
                        control={<Checkbox />}
                        label="email : Demo@myDigitalTwin.com"
                        labelPlacement="end"
                    />
                </li>
                <li>
                    <FormControlLabel
                        control={<Checkbox />}
                        label="SMS : +33 (0) 6 22 33 44 55"
                        labelPlacement="end"
                    />
                </li>
            </ul>
        </div >
        <div>
            Seuil d'alerte COVID-19 : densité =&gt; 4 m²/visiteurs
        </div>
    </div >
}

export default formules;
