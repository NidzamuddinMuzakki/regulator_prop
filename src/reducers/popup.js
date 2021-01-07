const initialState = {
    isOpen:false
}
function popup(state = initialState, action){

    switch(action.type){
        case "OPEN":
            const stateuser = {...state}
            if(action.payload){
                stateuser.isOpen = action.payload.isOpen;
               
            }
            return {...stateuser}
        case "CLOSE":     
            const stateuser1 = {...state}
            if(action.payload){
                stateuser1.isOpen = action.payload.isOpen;
               
            }
            return {...stateuser1}
      
        default:
            return state;
    }
}
export default popup;