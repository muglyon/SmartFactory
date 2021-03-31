import React from "react";
import App, { AppProps } from "next/app";
import { Store, AnyAction } from 'redux';
import appStore from '../src/reducers/store';
import Head from 'next/head';
import Layout from '../src/components/Layout';
import constantes from '../src/utils/constantes';
import { User, AuthentifiedProps } from '../src/types/Auth';
import { NoSsr } from '@material-ui/core';
import Modal from "../src/components/Modal";
import '../src/styles/style.css';
import SocketProvider from '../src/components/SocketProvider'

interface SmartFactoryProps extends AppProps {
    store: Store<any, AnyAction>
}

/**
 * This component is called before the application's start.
 */
class SmartFactory extends App<SmartFactoryProps> {

    // Unique instance. Each instance create one socket connection
    SocketProvider: JSX.Element;

    constructor(props: any) {
        super(props)
        this.SocketProvider = <SocketProvider />;
    }

    static async getInitialProps({ Component, ctx }) {

        // let layoutProps: Partial<AuthentifiedProps>;
        // if (process.browser) {
        //     const initialProps = (window as any).__NEXT_DATA__.props.initialProps.pageProps
        //     layoutProps = {
        //         roles: initialProps.roles,
        //         userName: initialProps.userName
        //     }
        // } else {
        //     const user: User = (ctx.req as any).user;
        //     layoutProps = {
        //         userName: user.displayName as string,
        //         roles: user.roles
        //     }
        // }
        let componentProps = {}

        if (Component.getInitialProps) {
            componentProps = await Component.getInitialProps({ ctx })
        }

        return {
            pageProps: {
                ...componentProps,
                // ...layoutProps
            }
        }
    }


    render(): any {
        const { Component, pageProps } = this.props;

        return (
            <>
                <Head>
                    <link rel="icon" href="/favicon.ico" />
                    <title>{constantes.WEBISTE_TITLE}</title>
                    <link crossOrigin="true" rel="stylesheet" href="https://atlas.microsoft.com/sdk/javascript/mapcontrol/2/atlas.min.css" type="text/css" />
                    <link crossOrigin="true" rel="stylesheet" href="https://atlas.microsoft.com/sdk/javascript/indoor/0.1/atlas-indoor.min.css" type="text/css" />
                    
                    <link rel="stylesheet" href="node_modules/azure-maps-drawing-tools/dist/atlas-indoor.min.css" type="text/css" />
                    <script src="node_modules/azure-maps-drawing-tools/dist/atlas-indoor.min.js"></script>

                    {/* 
                    <script crossOrigin="true" src="node_modules/azure-maps-control/dist/atlas.min.js"></script>
                    <script crossOrigin="true" src="node_modules/azure-maps-indoor/dist/atlas-indoor.min.js"></script> */}
                    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                </Head>
                <Layout {...pageProps}>
                    {this.SocketProvider}
                    <NoSsr>
                        <Component {...pageProps} />
                    </NoSsr>
                    <Modal />
                </Layout>
            </>
        );
    }
}

export default appStore.withRedux(SmartFactory);