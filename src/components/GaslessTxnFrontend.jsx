import React, { Component } from 'react';
import {RelayTxn} from "./RelayTxn";

export class GaslessTxnFrontend extends Component {

    handleGaslessTxnClick(){

        const url = `http://localhost:8080/relay/test`
        fetch(url, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json', // eslint-disable-line quote-props
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 'fromAddress':"323" , 'userid': userId })
        })
            .then(
                function(response) {
                    if (response.status !== 200) {
                        console.log('API CALL UNSUCCESSFUL' +
                            response.status);
                        return;
                    }
                }
            )
            .catch(function(err) {
                console.log('Fetch Error :-S ', err);
            });

    }

    render() {
        return (
            <div>
                <h3>Sign Typed Data V4</h3>
                <RelayTxn/>
            </div>
        )
    }
}
