import React, {Component} from 'react'

let temp=['sugar','spice','everything nice']

export default class Ingredients extends Component {
    render () {
        return (
            <div className='ingredients'>
                {temp.map((ingredient)=> {
                    return <ul>{ingredient}</ul>
                })}
            </div>
        )
    }
}