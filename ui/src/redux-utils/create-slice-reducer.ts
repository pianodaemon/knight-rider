/**
 * Creates a reducer for the given sliceName
 * Handlers can be added to the reducer using the addHandlers function
 */

export function createSliceReducer(
  sliceName: string,
  initialState: any,
  handlers: any,
): any {
  function reducer(state: any = initialState, action: any): any {
    // var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0]: initialState;
    // var action = arguments[1];

    if (action.type in reducer.handlers) {
      return reducer.handlers[action.type](state, action);
    }
    return state;
  }

  reducer.sliceName = sliceName;
  reducer.handlers = handlers || {};

  // eslint-disable-next-line func-names
  reducer.addHandlers = function (newHandlers: any) {
    reducer.handlers = {
      ...reducer.handlers,
      ...newHandlers,
    };
  };

  return reducer;
}
