import React from 'react';
import {Label, Popup, Header, Button, Grid } from 'semantic-ui-react'

const MeetingDetails = (props) => {
    if(props.data.length === 0){
        return null
    }


    const content = props.data.map(({start, end, location, subject, organizers}, index) => {
        return (
            <Grid.Column key={index} textAlign='center'>
                <Header as='h4'>{subject}</Header>
                <p>
                    {start} : {end}
                </p>
                <p>
                    {location}
                </p>
                <Button color='red'>Cancel</Button>
            </Grid.Column>
        )
    })

    return <Popup wide hoverable flowing
                  trigger={
                      <Label size='mini'>{props.data.length} Meetings</Label>
                  }
            >
            <Grid centered divided columns={props.data.length}>{content}</Grid>
            </Popup>
}


export default MeetingDetails