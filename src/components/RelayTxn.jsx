import React, {Component} from 'react';
import {Button} from "semantic-ui-react";


export class RelayTxn extends Component {
    constructor(props) {
        super(props);
        this.state = {value: ''};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    async checkEthWallet() {
        if (typeof window.ethereum === 'undefined') {
            alert('MetaMask is not installed!');
        }
    }

    async makeConnectionRequestAndGetEthAccountAddress() {
        const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
        return accounts[0];
    }

    async getPermitEIP712(account) {
        const url = `http://3.111.246.24:8080/relay/generatepermittypeddata`;
        const result = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json', // eslint-disable-line quote-props
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({'fromAddress': account, 'value': this.state.value})
        });
        return result;
    }

    async getMetaTxnEIP712Data(requestPayload) {
        const url = `http://3.111.246.24:8080/relay/createmetatxn`;
        const result = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json', // eslint-disable-line quote-props
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestPayload)
        });
        return result;
    }

    async relayTxn(signature, metaTxn) {
        const request = metaTxn.message;
        const url = `http://3.111.246.24:8080/relay/relaymetatxn`;
        const result = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json', // eslint-disable-line quote-props
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({signature,request})
        });
        return result;
    }


    async signTypedData(account, params){
        return window.ethereum.request({
            method: 'eth_signTypedData_v4',
            params: [
                account,
                JSON.stringify(params)
            ]
        });
    }


    async signPermitData(permitEIP712Data, account) {
        const params = permitEIP712Data;

        try {
            const transactionHash = await this.signTypedData(account,params);
            const r = transactionHash.slice(0, 66);
            const s = "0x" + transactionHash.slice(66, 130);
            const v = Number("0x" + transactionHash.slice(130, 132));

            let permitTxnData = {
                owner: permitEIP712Data.message.owner,
                spender: permitEIP712Data.message.spender,
                value: permitEIP712Data.message.value,
                deadline: permitEIP712Data.message.deadline
            };

            const signedPermitTxnData = Object.assign({}, permitTxnData, {
                v,
                r,
                s
            });
            const metaTxnEIP712Data = await this.getMetaTxnEIP712Data(signedPermitTxnData);
            const metaTxnEIP712DataResolved = await metaTxnEIP712Data.json()
            try {
                const metaTransactionHash = await this.signTypedData(account,metaTxnEIP712DataResolved) ;
                const result = await this.relayTxn(metaTransactionHash,metaTxnEIP712DataResolved);
            } catch (error) {
                console.error(error);
            }

        } catch (error) {
            console.error(error);
        }
    }

    async handleSubmit() {
        await this.checkEthWallet();
        const account = await this.makeConnectionRequestAndGetEthAccountAddress();
        console.log(account);
        const result = await this.getPermitEIP712(account);
        const permitEIP712Data = await result.json();
        await this.signPermitData(permitEIP712Data.typedData, account)
    }

    render() {
        return (
            <div>
                <p>
                    UNI-ETH ExchangeValue : Send UNI get ETH
                </p>
                <input type="number" value={this.state.value} onChange={this.handleChange}/>
                <Button onClick={this.handleSubmit}> Submit </Button>
            </div>

        );
    }
}