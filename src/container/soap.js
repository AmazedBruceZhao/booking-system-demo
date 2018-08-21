import React, { Component } from 'react';

class SoapClient extends Component {
    constructor(props){
        super(props)
        this.state = {
            response: '',
            result : ''
        }
    }

    render(){
        return (
            <div>
                {this.state.result}
            </div>
        )
    }

    componentDidMount(){
        const username = 'bruce.zhao@esi-asia.com'
        const password = 'P@ssw0rd2018'
        fetch('https://outlook.office365.com/EWS/Services.asmx', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/xml',
                'Authorization': 'Basic ' + btoa(username + ":" + password),
            },
            body: '<?xml version="1.0" encoding="UTF-8"?>\n' +
                '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"\n' +
                '               xmlns:t="http://schemas.microsoft.com/exchange/services/2006/types"\n' +
                '               xmlns:m="http://schemas.microsoft.com/exchange/services/2006/messages">\n' +
                '   <soap:Header>\n' +
                '      <t:RequestServerVersion Version="Exchange2013" />\n' +
                '   </soap:Header>\n' +
                '   <soap:Body >\n' +
                '      <m:FindPeople>\n' +
                '         <m:IndexedPageItemView BasePoint="Beginning" MaxEntriesReturned="100" Offset="0"/>\n' +
                '         <m:ParentFolderId>\n' +
                '            <t:DistinguishedFolderId Id="contacts"/>\n' +
                '         </m:ParentFolderId>\n' +
                '      </m:FindPeople>\n' +
                '   </soap:Body>\n' +
                '</soap:Envelope>'
        }).then(res => {
            return res.text()
        }).then(data => {
            this.setState({
                result : data.toString()
            })
        })
    }
}

export default SoapClient
