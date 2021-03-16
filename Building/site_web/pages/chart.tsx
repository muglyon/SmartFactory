import { GetServerSideProps } from 'next';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AuthentifiedProps } from '../src/types/Auth';
import { ChartData, ChartPageRequestQuery } from "../src/types/ChartPageProps"
import { GlobalState } from '../src/types/globalState';
import { ProjectList } from '../src/types/datas';
import DatabaseService from '../src/service/Database.service';
import setGraphData from '../src/actions/datas/setGraphData';
import GraphProxy from '../src/components/Graph/GraphProxy';
import "../src/styles/graph.scss"

export default function chart(props: ChartPageRequestQuery & AuthentifiedProps) {
  const currentProjectList = useSelector<GlobalState, ProjectList | undefined>((state) => state.datas.CET.current);

  const dispatch = useDispatch();
  useEffect(() => {
    if (currentProjectList) {
      DatabaseService.queryGraphData(currentProjectList.CETEssai, props.name).then((values) => {
        dispatch(setGraphData(values))
      })
    }

  }, [currentProjectList, props]);

  return <>
    <GraphProxy />
  </>
}

export const getServerSideProps: GetServerSideProps<ChartData> = async (context) => {
  const query: ChartPageRequestQuery = context.query as unknown as ChartPageRequestQuery;

  return {
    props: {
      ...query
    }
  }
}
