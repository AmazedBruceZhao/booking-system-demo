import React, { Component } from 'react';

class Day extends Component{
    render(){
        const content = this.props.data
        return (
            <div>
                <p>{content.subject}</p>
                <p>{content.start}</p>
                <p>{content.end}</p>
                <p>{content.location}</p>
                <p>{content.organizers.map((organizer) => {
                    return (
                        <p>{organizer}</p>
                    )
                })}
                </p>
            </div>
        )
    }
}

export default Day