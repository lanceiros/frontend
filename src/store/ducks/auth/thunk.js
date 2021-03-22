import isEmpty from 'lodash.isempty';

import api from '@services/api';
import appInfo from '@utils/appInfo';
import { errorHandler } from '@utils';
import { Creators as UserCreators } from '../user';
import { Creators as SessionCreators } from '../session';
import { Creators as AuthCreators } from './index';
import { Creators as AppCreators } from '../app';

const { sessionSetFirstAccess } = SessionCreators;
const { userLogout, userSetLoginStart, userSetCurrentUser } = UserCreators;
const { authSetErrorIdentify, authSetIdentify, authSetWlIdentify, authDelIdentify } = AuthCreators;
const { appSetConfig } = AppCreators;

export const loginThunk = ({ keepMeLogged, ...userIndentify }) => async dispatch => {
  dispatch(userSetLoginStart());

  const { data, error } = await api.authenticate(userIndentify).catch(errorHandler);

  if (!isEmpty(error)) {
    dispatch(userLogout());
    dispatch(authSetErrorIdentify(error, error.message));
    return;
  }

  const { userId, userName, email, schema, roles, nameUrl, apiKey, ...identify } = data;
  const user = {
    userId,
    userName,
    email,
    schema,
    roles,
    nameUrl,
    apiKey
  };

  appInfo.apiKey = apiKey;

  dispatch(authSetIdentify(identify));
  dispatch(sessionSetFirstAccess());
  dispatch(userSetCurrentUser(user, keepMeLogged));
  dispatch(appSetConfig({ nameUrl, apiKey }));
};

export const logoutThunk = () => {
  return dispatch => {
    dispatch(userLogout());
    dispatch(authDelIdentify());
  };
};

export const wlLoginThunk = accessToken => async dispatch => {
  // TODO: get data from endpoint and validate access_token
  const user = {
    userId: 0,
    userName: 'WL User',
    roles: [],
    nameUrl: 'http://localhost/{idPatient}',
    apiKey: '000'
  };

  dispatch(authSetWlIdentify({ access_token: accessToken }));
  dispatch(userSetCurrentUser(user, false));
  dispatch(appSetConfig({ nameUrl: user.nameUrl, apiKey: user.apiKey }));
};
