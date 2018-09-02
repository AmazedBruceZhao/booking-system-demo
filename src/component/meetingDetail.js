import React from 'react';
import { Header, Button, Grid } from 'semantic-ui-react'
import soap from '../lib/soap'
import xml2js from "xml2js";

const MeetingDetail = (props) => {

    const {id, start, end, location, subject, organizers} = props.data;
    return (
        <Grid.Column textAlign='center'>
            <Header as='h4'>{subject}</Header>
            <p>
                {start} : {end}
            </p>
            <p>
                {location}
            </p>
            <Button color='red' onClick={(e) => {
                const query = '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"\n' +
                    '  xmlns:t="http://schemas.microsoft.com/exchange/services/2006/types">\n' +
                    '  <soap:Body>\n' +
                    '    <DeleteItem DeleteType="MoveToDeletedItems" SendMeetingCancellations="SendToAllAndSaveCopy" xmlns="http://schemas.microsoft.com/exchange/services/2006/messages">\n' +
                    '      <ItemIds>\n' +
                    `      <t:ItemId Id="${id.Id}"/>\n` +
                    '      </ItemIds>\n' +
                    '    </DeleteItem>\n' +
                    '  </soap:Body>\n' +
                    '</soap:Envelope>';

                //console.log(query)
                soap(query).then(res => {
                    return res.text()
                }).then(data => {
                    //console.log(data)
                    let that = this
                    xml2js.parseString(data, function (err, result) {
                        if (!err){
                            //console.log(result);
                            let res = result['s:Envelope']["s:Body"][0]["m:DeleteItemResponse"][0]["m:ResponseMessages"][0]["m:DeleteItemResponseMessage"][0]
                            let responseClass = res["$"]["ResponseClass"]
                            let responseCode = res["m:ResponseCode"]
                            if (responseClass === 'Success'){

                            }
                        }//
                    });
                })
            }}>Cancel</Button>
        </Grid.Column>
    )
}

export default MeetingDetail;