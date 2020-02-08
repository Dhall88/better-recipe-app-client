import React, { Component } from 'react';
import './App.css';

import Timer from './components/Timer.js';

const apiKey='ffcad7d6d56f4eb39e6c0f742e23016e';

class App extends Component {
  state={
    label: '',
    seconds: 0,
    minutes: 0,
    hours: 0,
    timerArr:[],
    searchString:'',
    searchResults:[],
    displaySearch:false,
    activeRecipe: [],
    activeRecipeName: '',
    displayActive: false,
    ingredients:[],
    savedRecipes:[],
    intro: true,
    activeRecipeId:'',
    editMode: false,
    activeDbId:0
  }

  componentDidMount = () => {
    this.getRecipes();
  }

  getRecipes = () => {
    fetch('http://localhost:3000/recipes')
    .then(response => response.json())
    .then(json => this.setState({savedRecipes: json}))
    .catch(error => console.error(error))
  }

  recipeSearch=(event)=>{
    event.preventDefault();
    fetch(`https://api.spoonacular.com/recipes/search?query=${this.state.searchString}&number=20&apiKey=${apiKey}`)
    .then((response) => response.json())
      .then((recipeSearch) => {
        this.setState({
          searchResults: recipeSearch.results,
          displaySearch: true,
          displayActive: false,
          intro: false
      })
      })
  }

  handleChange = (event) => {
    this.setState({ [event.target.id]: event.target.value })
  }

  activeRecipe = (event) => {
    event.preventDefault();
    console.log(event.target.id);
    console.log(event.currentTarget.id);
    let id_arr=event.currentTarget.id.split(',');
    let name=id_arr[0]
    let api_id=id_arr[1];
    let database=id_arr[2];
    console.log(database);
    fetch(`https://api.spoonacular.com/recipes/${api_id}/analyzedInstructions?apiKey=${apiKey}`)
    .then((response) => response.json())
      .then((recipeInstructions) => {
        this.setState({
          activeRecipe: recipeInstructions[0].steps,
          displayActive: true,
          displaySearch: false,
          intro: false,
          activeRecipeName: name,
          activeRecipeId: api_id,
          activeDbId: database
        })
      })

      fetch(`https://api.spoonacular.com/recipes/${api_id}/ingredientWidget.json?apiKey=${apiKey}`)
      .then((response) => response.json())
        .then((recipeIngredients) => {
          this.setState({
            ingredients: recipeIngredients.ingredients
          })
        })
  }

  timerSubmit =(event) => {
    event.preventDefault()
    let arrItem = [this.state.seconds,this.state.minutes,this.state.hours,this.state.label]
    this.setState({
      label:'',
      seconds:0,
      minutes:0,
      hours:0,
      timerArr:[...this.state.timerArr,arrItem]
    })
  }

  editMode = (event) => {
    event.preventDefault();
    this.setState({
      editMode: true
    })
  }

    updateRecipe = (event) => {
      event.preventDefault();
      console.log(this.state.activeDbId);
      fetch('http://localhost:3000/recipes/' + this.state.activeDbId, {
        body: JSON.stringify({name: this.state.activeRecipeName}),
        method: 'PUT',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        }
      })
        .then(updatedRecipe => updatedRecipe.json())
        .then(recipeToDo => {
          fetch('http://localhost:3000/recipes')
            .then(response => response.json())
            .then(recipes => {
              this.setState({ savedRecipes: recipes, editMode: false})
            })
        })
    }


  saveRecipe = (event) => {
    event.preventDefault()
    fetch('http://localhost:3000/recipes', {
      body: JSON.stringify({name: this.state.activeRecipeName, api_id: parseInt(this.state.activeRecipeId)}),
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      }
    })
    .then(createdRecipe => {
      return createdRecipe.json()
    })
    .then(jsonedRecipe => {
      this.setState({
        savedRecipes: [...this.state.savedRecipes, jsonedRecipe]
      })
    })
    .catch(error => console.log(error))
  }

  render() {
    return(
      <div className='main'>

        <h1>Better Recipes</h1>

          <div className='container'>

            <div className='saved-timer'>

              <div className='saved-recipes'>
                <h3>Saved Recipes</h3>
                <ul>
              {this.state.savedRecipes.map((recipe,index) => {
                return  <li id={`${recipe.name},${recipe.api_id},${recipe.id}`} onClick={this.activeRecipe}>{recipe.name}</li>
              })}
                </ul>
              </div>

              <div className='timer-container'>
                <h3>Timers</h3>
                <form className='timer-form'>
                  <label htmlFor ='label'>label:</label>
                  <input className="label" type='text' value={this.state.label} onChange={this.handleChange} id='label' />
                  <br />
                  <div className="time-units">
                  <label htmlFor='seconds'>seconds:</label>
                  <input type='number' value={this.state.seconds} onChange={this.handleChange} id='seconds' />
                  <br />
                  <label htmlFor='minutes'>minutes:</label>
                  <input type='number' value={this.state.minutes} onChange={this.handleChange} id='minutes' />
                  <br />
                  <label htmlFor='hours'>hours:</label>
                  <input type='number' value={this.state.hours} onChange={this.handleChange} id='hours' />
                  </div>
                  <br />
                  <input type='submit' value='Create Timer' onClick={this.timerSubmit} />
                </form>

                  <div className='center-timers'>
                  {this.state.timerArr.map((timer)=> {
                        return <Timer label={timer[3]} seconds={timer[0]} minutes={timer[1]} hours={timer[2]}/>
                      }
                    )}
                  </div>

              </div>
            </div>

              <div className='recipe-container'>
                <form className='recipe-form' onSubmit={this.recipeSearch}>
                  <label htmlFor='searchString'>Search Recipes:</label>
                  <input type='text' value={this.state.searchString} onChange={this.handleChange} id='searchString' />
                  <input type='submit' value='Search'/>
                </form>

                {this.state.intro===true?
                  <p className='intro'>"Welcome to a better recipe app! There will be no blogs, no remenisinciing about balmly summer evenings, and absolutely no needless scrolling everytime you need to check a measurement.  Search a database of 500,000 recipes by keyword (eg. Burger, Casserole, chicken taco...) and enjoy.  Favorite recipes can be saved by hitting the 'Save Recipe' button and can be revisited later."</p> :''
                }

                <React.Fragment>
                  <div className='search-list'>
                  {this.state.displaySearch===true?
                    (this.state.searchResults.map((recipe,index)=>{
                      return <div id={[recipe.title,recipe.id]} onClick={this.activeRecipe}>
                              <p>{recipe.title}</p>
                              <img src={`https://spoonacular.com/recipeImages/${recipe.image}`} />
                            </div>
                    })):''
                  }
                  </div>
                </React.Fragment>

                <React.Fragment>
                {this.state.displayActive===true?
                  <React.Fragment>
                    {this.state.editMode===true?
                      <form onSubmit={this.updateRecipe}>
                        <input type='text' value={this.state.activeRecipeName} onChange={this.handleChange} id={'activeRecipeName'} />
                        <input type='submit' value='Save Recipe Title' />
                      </form>
                      :<h4 onClick={this.editMode}>{this.state.activeRecipeName}</h4>}

                    <form className='save-form' onSubmit={this.saveRecipe}>
                      <input type='hidden' value={this.state.activeRecipeName} onChange={this.handleChange} id='name' />
                      <input type='hidden' value={this.state.activeRecipe} onChange={this.handleChange} id='instructions' />
                      <input type='hidden' value={this.state.ingredients} onChange={this.handleChange} id='ingredients' />
                      <input type='submit' value='Save Recipe'/>
                    </form>

                  </React.Fragment>

                :''}
                </React.Fragment>

                <React.Fragment>
                    {this.state.displayActive===true?
                      <ul className='instructions'>
                        {this.state.activeRecipe.map((steps) => {
                      return <li>{steps.step}</li>
                    })} </ul> :''
                    }
                </React.Fragment>
                </div>

                <div className='ingredient-placeholder'>
                <h3>Ingredients</h3>
                {this.state.displayActive===true?
                  <React.Fragment>

                    <div className='ingredients'>
                      <ul>
                      {(this.state.ingredients.map((ingredient) => {
                        return <li>{`${ingredient.amount.us.value} ${ingredient.amount.us.unit} of ${ingredient.name}`}</li>
                      }))}
                      </ul>
                    </div>
                    </React.Fragment>
                  :''
                }
                </div>


        </div>

      </div>
    )
  }
}

export default App;