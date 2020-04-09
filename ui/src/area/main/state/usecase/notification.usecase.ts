import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { mainReducer } from '../main.reducer';

const postfix = '/app';
const NOTIFICATION = `NOTIFICATION${postfix}`;
const NOTIFICATION_CLOSE = `NOTIFICATION_CLOSE${postfix}`;

export const notificationAction: ActionFunctionAny<Action<any>> = createAction(
  NOTIFICATION
);

export const notificationCloseAction: ActionFunctionAny<
  Action<any>
> = createAction(NOTIFICATION_CLOSE);

const mainReducerHandlers = {
  [NOTIFICATION]: (state: any, action: any) => {
    const { message, autoHideDuration, type } = action.payload;
    return {
      ...state,
      snackbarNotifier: {
        ...state.snackbarNotifier,
        autoHideDuration: autoHideDuration || state.autoHideDuration,
        message,
        isOpen: true,
        type,
      },
    };
  },
  [NOTIFICATION_CLOSE]: (state: any) => {
    return {
      ...state,
      snackbarNotifier: {
        ...state.snackbarNotifier,
        message: null,
        isOpen: false,
        type: null,
      },
    };
  },
};

mainReducer.addHandlers(mainReducerHandlers);
