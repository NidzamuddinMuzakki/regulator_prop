const initialState = {
    selectedUser:0,
    selectedId:[]
}
function userSettingReducer(state = initialState, action){

    switch(action.type){
        case "SELECTEDUSER":
          
            const stateuser = {...state}
            if(action.payload){
                stateuser.selectedUser = action.payload.selectedUser;
                stateuser.selectedId = action.payload.selectedId;
            }
            return {...stateuser}
        default:
            return state;
    }
}
export default userSettingReducer;