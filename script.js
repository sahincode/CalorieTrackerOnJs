class CalorieTracker {
  constructor() {
    this._colorieLimit = CustomStorage.getCalorieLimit();
    this._totalCalories = CustomStorage.getCaloriesTotal(0);
    this._meals = CustomStorage.getMeals();
    this._workouts = CustomStorage.getWorkouts();
    this.displayCaloriesTotal();
    this.displayCaloryLimit();
    this.displayCalorieConsumed();
    this.displayCalorieBurned();
    this.displayCalorieRemaining();
    this.displayCalorieProgress();
  }
  //API
  addWorkOut(workout) {
    this._workouts.push(workout);
    CustomStorage.setWorkout(workout)
    this._totalCalories -= workout.calories;
    CustomStorage.setCaloriesTotal(this._totalCalories);

    this._displaynewItem('workout',workout); 
    this._render();
  }
  removeWorkout(id){
    const index=this._workouts.findIndex(w=>w.id==id);
    if(index!=-1){
      const workout=this._workouts[index];
    this._totalCalories+=workout.calories;
    CustomStorage.setCaloriesTotal(this._totalCalories);
  
    this._workouts.splice(index,1);
    CustomStorage.RemoveWorkoutFromLocal(id);
    this._render();
    }
  }
  addMeal(meal) {
    this._meals.push(meal);
   
    this._totalCalories += meal.calories;
    CustomStorage.setCaloriesTotal(this._totalCalories);
    CustomStorage.setMeal(meal);

    this._displaynewItem('meal',meal);

    this._render();

  }
  removeMeal(id){
    const index=this._meals.findIndex(meal=>meal.id==id);
    if(index!=-1){
      const meal=this._meals[index];
      
    this._totalCalories-=meal.calories;
    CustomStorage.setCaloriesTotal(this._totalCalories);
  
    this._meals.splice(index,1);
    CustomStorage.RemoveMealFromLocal(id);
    this._render();
    }
  }
 
  setLimit(calorielimit){
    this._colorieLimit=calorielimit;
    CustomStorage.setCalorieLimit(calorielimit);
  this.displayCaloryLimit() 
  this._render();
 }
  reset(){
    this._totalCalories=0;
    this._meals=[];
    this._workouts=[];
    CustomStorage.RemoveAllMeals();
    CustomStorage.RemoveAllWorkouts();
    localStorage.removeItem('calorieTotal');
   
    this._render();
  }
  reloadItem(){
    this._meals.forEach(meal=> this._displaynewItem('meal',meal));
    this._workouts.forEach(workout=> this._displaynewItem('workout',workout));
  }
  //Private methods for developer
  displayCaloriesTotal() {
    const totalcaloriesEL = document.getElementById('total-calories');
    totalcaloriesEL.innerHTML = this._totalCalories;
   
    
  }
  displayCaloryLimit() {
    const calorieLimitEL = document.getElementById('limit-calories');
    calorieLimitEL.innerHTML = this._colorieLimit;
  }
  _displaynewItem(type, item) {
    const itemsEL = document.getElementById(`${type}-items`);
    const itemEl = document.createElement('div');
    itemEl.setAttribute(`${type}-id`,item.id);
    itemEl.classList.add('card', 'my-2');
     if(type==='meal'){
      itemEl.innerHTML = `<div class="card-body  w-100 ">
    <div  id="meal-item" class="d-flex justify-content-between align-items-center">
    <h5 class="card-title">${item.name}</h5>
      <div class="fs-2  bg-success text-white text-center-rounded-2 px-2 px-sm-5 rounded">${item.calories}</div>
    <button class="btn btn-danger delete ">
    <i class="fa-solid fa-delete-left"></i> 
    </button>
    </div>

   </div>`
     }
     else if(type==='workout'){
      itemEl.innerHTML = `<div class="card-body  w-100 ">
    <div  id="meal-item" class="d-flex justify-content-between align-items-center">
    <h5 class="card-title">${item.name}</h5>
      <div class="fs-2  bg-warning text-white text-center-rounded-2 px-2 px-sm-5 rounded">${item.calories}</div>
    <button class="btn btn-danger ">
    <i class="fa-solid fa-delete-left"></i> 
    </button>
    </div>

   </div>`
     }
    
    itemsEL.appendChild(itemEl);
  }
 
  _render() {
    this.displayCaloriesTotal();
    this.displayCalorieConsumed();
    this.displayCalorieBurned();
    this.displayCalorieRemaining();
    this.displayCalorieProgress()
    

  }
  displayCalorieConsumed() {

    const calorieConsumed = document.getElementById('consumed-calories');
    const consumed = this._meals.reduce((total, meal) => total + meal.calories, 0)
    calorieConsumed.innerHTML = consumed;
  }
  displayCalorieBurned() {

    const calorieburned = document.getElementById('burned-calories');
    const burned = this._workouts.reduce((total, workout) => total + workout.calories, 0)
    calorieburned.innerHTML = burned;
  }
  displayCalorieRemaining() {
    const progress = document.getElementById('calorie-progress');

    const calorieremaining = document.getElementById('remaining-calories');
    const remained = this._colorieLimit - this._totalCalories;
    calorieremaining.innerHTML = remained;
    if (remained <= 0) {
      calorieremaining.parentElement.parentElement.classList.remove('bg-light');
      calorieremaining.parentElement.parentElement.classList.add('bg-danger');
      progress.classList.remove('bg-success');
      progress.classList.add('bg-danger')
    }
    else {
      calorieremaining.parentElement.parentElement.classList.remove('bg-danger');
      calorieremaining.parentElement.parentElement.classList.add('bg-light');
      progress.classList.remove('bg-danger')
      progress.classList.add('bg-success');
    }
  }
  displayCalorieProgress() {
    const progress = document.getElementById('calorie-progress');
    const percent = (this._totalCalories / this._colorieLimit) * 100;
    const width = Math.min(percent, 100);
    progress.style.width = ` ${width}%`


  }
}

class Meal {
  constructor(name, calories) {
    this.id = Math.random().toString(16).slice(2);
    this.name = name;
    this.calories = calories;
  }
}
class WorkOut {
  constructor(name, calories) {
    this.id = Math.random().toString(16).slice(2);
    this.name = name;
    this.calories = calories;

  }
}
class CustomStorage{
  ///calorieLimit localStorage get =/set 
  static getCalorieLimit(defaultLimit=2000){
    let calorieLimit;
    if(localStorage.getItem('calorieLimit')===null){
      calorieLimit=defaultLimit
    }
    else{
      calorieLimit=localStorage.getItem('calorieLimit');
      

    }
    return calorieLimit;
  }
  static setCalorieLimit(calorieLimit){
    localStorage.setItem('calorieLimit',+calorieLimit)
  }
  ///calorieLimit localStorage get/set
  static getCaloriesTotal(_caloriesTotal){
    let calorieTotal;
    if(localStorage.getItem('calorieTotal')===null){
      calorieTotal=_caloriesTotal;
    }
    else{
      calorieTotal=+localStorage.getItem('calorieTotal');
    }
    return calorieTotal;  
  }
    static setCaloriesTotal(_caloriesTotal){
      localStorage.setItem('calorieTotal',_caloriesTotal);
       
    }
    //methods to remove all ,add , delete by id workouts from local
    static getWorkouts() {
      let workouts;
      if (localStorage.getItem('workouts') === null) {
        workouts = [];
      } else {
        workouts = JSON.parse(localStorage.getItem('workouts'));
      }
      
      return workouts;
    }
    
    static setWorkout(workout) {
      
      const workouts = CustomStorage.getWorkouts(); // Corrected method call
      workouts.push(workout);
      localStorage.setItem('workouts', JSON.stringify(workouts)); 
    }
    static RemoveWorkoutFromLocal(id){
       const workouts = CustomStorage.getWorkouts();
      workouts.forEach((workout,index)=>{
        if(workout.id===id){
         workouts.splice(index,1);
        }
      });
      localStorage.setItem('workouts',JSON.stringify(workouts))
    }
    static RemoveAllWorkouts(){
      const workouts= CustomStorage.getWorkouts();
      if(workouts!==null){
        workouts.splice(0,workouts.length);
      }
      localStorage.setItem('workouts',JSON.stringify(workouts));
    }
    // methods to add ,delete remove all meals from local
    static getMeals() {
      let meals;
      if (localStorage.getItem('meals') === null) {
        meals = [];
      } else {
        meals = JSON.parse(localStorage.getItem('meals'));

      }
      
      return meals;
    }
    static setMeal(meal) {
      
      const meals = CustomStorage.getMeals(); // Corrected method call
      meals.push(meal);
      localStorage.setItem('meals', JSON.stringify(meals)); 
    }
    static RemoveMealFromLocal(id){
     const  meals = CustomStorage.getMeals();
      meals.forEach((meal,index)=>{
        if(meal.id===id){
         meals.splice(index,1);
        }
      });
      localStorage.setItem('meals',JSON.stringify(meals))
    }
    static RemoveAllMeals(){
      const meals= CustomStorage.getMeals();
      if(meals!==null){
        meals.splice(0,meals.length);
      }
      localStorage.setItem('meals',JSON.stringify(meals));
    }
   
}



class App {
  constructor() {
    this._tracker = new CalorieTracker();
    document.getElementById('meal-form').addEventListener('submit', this._newItem.bind(this, 'meal'))
    document.getElementById('workout-form').addEventListener('submit', this._newItem.bind(this, 'workout'));
    document.getElementById('meal-items').addEventListener('click', this._removeItem.bind(this, 'meal'))
    document.getElementById('workout-items').addEventListener('click', this._removeItem.bind(this, 'workout'));
    document.getElementById('filter-meals').addEventListener('keyup',this._filterItems.bind(this,'meal'))
    document.getElementById('filter-workouts').addEventListener('keyup',this._filterItems.bind(this,'workout'))
     document.getElementById('reset').addEventListener('click',this._resetAll.bind(this));
    document.getElementById('limit-form').addEventListener('submit',this._setLimit.bind(this));
   //reload item for showing update of the meals and workout 
   this._tracker.reloadItem();
   }



  _newItem(type, e) {
    e.preventDefault();
    const name = document.getElementById(`${type}-name`);
    const calories = document.getElementById(`${type}-calories`);
    if (name.value === '' || calories.value === '') {
      alert("please fill in all fields ");
      return;
    }
    if (type === 'meal') {
      const meal = new Meal(name.value, +calories.value);
      this._tracker.addMeal(meal);

    }
    else {
      const workout = new WorkOut(name.value, +calories.value);
      this._tracker.addWorkOut(workout);

    }
    name.value = '';
    calories.value = '';
    const collapseItem = document.getElementById(`collapse-${type}`);
    const bsCollapse = new bootstrap.Collapse(collapseItem, {
      toggle: true
    })


  }
  _removeItem(type,e){
    if(e.target.classList.contains('delete')||
    e.target.classList.contains('fa-delete-left')){
      if(confirm('Are you sure?')){
        const id =e.target.closest('.card').getAttribute(`${type}-id`);
       
        type==='meal'?       
         this._tracker.removeMeal(id):
         this._tracker.removeWorkout(id);
         e.target.closest('.card').remove();
      }
    }
  }
  _filterItems(type,e){
    const inputText=e.target.value.toLowerCase();
   document.querySelectorAll(`#${type}-items .card`).forEach(item=>
    {
      const name=item.firstElementChild.firstElementChild.textContent;
      if(name.toLowerCase().indexOf(inputText)!=-1){
        item.style.display='block'
      }else{
        item.style.display='none';
      }
    });

  }
  _resetAll(){
    this._tracker.reset();
    document.getElementById('meal-items').innerHTML='';
    document.getElementById('workout-items').innerHTML='';
    

  }
  _setLimit(e){
    e.preventDefault();

    const limit =document.getElementById('limit');
    if(limit.value==''){
      alert('Please add limit');
      return 
    }
    this._tracker.setLimit(+limit.value);
    limit.value='';
    const modalEL= document.getElementById('limit-modal');
    const modal=bootstrap.Modal.getInstance(modalEL);
    modal.hide();
    
  }
   
   

}

const app = new App();
function checkTimeThenReset(){
  const time= new Date();
  const hours=time.getHours();
 
  const minutes=time.getMinutes();
  
 
  const seconds=time.getSeconds();
  const milliSeconds=time.getMilliseconds();
  if(hours==0&& minutes==0){
   app._resetAll();
  }
 
 
  }

setInterval(checkTimeThenReset,30000);

