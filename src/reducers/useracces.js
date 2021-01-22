const initialState = {
    accessview:false,
    accessdelete:false,
    accessupdate:false,
    accesscreate:false
}
function useracces(state = initialState, action){

    switch(action.type){
        case "YES":
            const stateuser = {...state}
            console.log("YES")
            if(action.payload){
                stateuser.accessview = action.payload.accessview?true:stateuser.accessview;
                stateuser.accessdelete = action.payload.accessdelete?true:stateuser.accessdelete;
                stateuser.accessupdate = action.payload.accessupdate?true:stateuser.accessupdate;
                stateuser.accesscreate = action.payload.accesscreate?true:stateuser.accesscreate;
               
            }
            return {...stateuser}
        case "NO":     
            const stateuser1 = {...state}
            if(action.payload){
                stateuser1.accessview = action.payload.accessview?false:stateuser1.accessview;
                stateuser1.accessdelete = action.payload.accessdelete?false:stateuser1.accessdelete;
                stateuser1.accessupdate = action.payload.accessupdate?false:stateuser1.accessupdate;
                stateuser1.accesscreate = action.payload.accesscreate?false:stateuser1.accesscreate;
               
            }
            return {...stateuser1}
      
        default:
            return state;
    }
}
export default useracces;