import { useSelector } from 'react-redux';
import '../src/styles/predict.scss'
import { Datas } from '../src/types/datas';
import { GlobalState } from '../src/types/globalState';

const prediction = () => {

    const twinData = useSelector<GlobalState, Datas>((state) => state.datas.twinData);

    const volume = twinData.Hall_03 ? twinData.Hall_03.width * twinData.Hall_03.height * twinData.Hall_03.length : "xxx"

    return <div className="card p-4">
        <h1>Scénario (fictif) : </h1>

        <div>Les chef d’Etats vont se rassembler au centre, et recevoir 3000 personnes dans le Hall 3 de {volume} m^3.</div>
        <div>
            <figure >
                <img src="/fiscality.png"
                    alt="Elephant at sunset" />
                <figcaption>Crédit photo : Scéance plénière au Grand Palais à Paris pour "Oséo Excellence", mercredi 16 mars 2011 D.R.
                    <br />
                    <a href="https://lentreprise.lexpress.fr/gestion-fiscalite/budget-financement/la-creme-des-entrepreneurs-reunie-au-grand-palais-a-paris_1524097.html">
                        https://lentreprise.lexpress.fr/gestion-fiscalite/budget-financement/la-creme-des-entrepreneurs-reunie-au-grand-palais-a-paris_1524097.html</a></figcaption>
            </figure>
        </div>
        <div>Pour éviter la transpiration de ces hommes et femmes politiques, il a été décidé que la température moyenne serait de 19°C à 1 m du sol.</div>
        <br />
        <div>Chacune de ces 3000 personnes génère de la chaleur, qu’il s’agira de compenser par davantage de froid.</div>
        <br />
        <div>Combien de jours avant est-ce que l’on doit activer les 2 pompes à air frais ETT (Energie Thermique Transfert) ?</div>
        <br />
        <div>L’IA basée sur des données issues du BigData permettra d’y répondre</div>
    </div>
}

export default prediction;
