const initialState = {
    menu : []
}
function MenuAccess(state = initialState, action){

    switch(action.type){
        case "MenuAccess":
            let stateuser = {...state}
            if(action.payload){
                stateuser.menu = action.payload.data;
                
               
            }
            return {...stateuser}
        default:
            return state;
    }
}
function menupilihan(state = initialState, action){

    switch(action.type){
        case "MenuPilihan":
            let stateuser = {...state}
            if(action.payload){
                stateuser.menu = action.payload.data;
                
               
            }
            return {...stateuser}
        default:
            return state;
    }
}
export { MenuAccess, menupilihan};