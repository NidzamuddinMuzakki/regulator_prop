const initialState = {
    isOpen:false
}
function popupDepart(state = initialState, action){

    switch(action.type){
        case "OPENDEPART":
            const stateuser = {...state}
            if(action.payload){
                stateuser.isOpen = action.payload.isOpen;
               
            }
            return {...stateuser}
        case "CLOSEDEPART":     
            const stateuser1 = {...state}
            if(action.payload){
                stateuser1.isOpen = action.payload.isOpen;
               
            }
            return {...stateuser1}
      
        default:
            return state;
    }
}



function popupGroup(state = initialState, action){

    switch(action.type){
        case "OPENGROUP":
            const stateuser = {...state}
            if(action.payload){
                stateuser.isOpen = action.payload.isOpen;
               
            }
            return {...stateuser}
        case "CLOSEGROUP":     
            const stateuser1 = {...state}
            if(action.payload){
                stateuser1.isOpen = action.payload.isOpen;
               
            }
            return {...stateuser1}
      
        default:
            return state;
    }
}
function popupRole(state = initialState, action){

    switch(action.type){
        case "OPENROLE":
            const stateuser = {...state}
            if(action.payload){
                stateuser.isOpen = action.payload.isOpen;
               
            }
            return {...stateuser}
        case "CLOSEROLE":     
            const stateuser1 = {...state}
            if(action.payload){
                stateuser1.isOpen = action.payload.isOpen;
               
            }
            return {...stateuser1}
      
        default:
            return state;
    }
}
function popupBranch(state = initialState, action){

    switch(action.type){
        case "OPENBRANCH":
            const stateuser = {...state}
            if(action.payload){
                stateuser.isOpen = action.payload.isOpen;
               
            }
            return {...stateuser}
        case "CLOSEBRANCH":     
            const stateuser1 = {...state}
            if(action.payload){
                stateuser1.isOpen = action.payload.isOpen;
               
            }
            return {...stateuser1}
      
        default:
            return state;
    }
}
export {
    popupDepart,
    popupGroup,
    popupBranch,
    popupRole
  };