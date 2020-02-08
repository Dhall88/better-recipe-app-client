import React, {Component} from 'react'

let temp = ['rice and beans', 'nails and milk', 'Steak Au Poire']

export default class Saved extends Component {
    render() {
        return (
            <div className='saved'>
                {temp.map((recipe) => {
                    return <ul>{recipe}</ul>
                })}
            </div>
        )
    }
}
