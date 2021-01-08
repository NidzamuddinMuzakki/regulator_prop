function dataapi(state = "", action){
    switch(action.type){
        case "GANTI":
            let stateuser = state
            if(action.payload){
                stateuser = action.payload;
            }
            return stateuser
       default:
           return state  
        }
    }
export default dataapi;    