import axios from 'axios';
import moment from 'moment';

/**
 *
 * @param {string} bearerToken
 * @param {object} requestConfig
 * @param {[object]} requestConfig.listToRequest array of object
 * containing the idPatient to request.
 * @param {{object}} requestConfig.listToEscape object of objects
 * containing the patients that has already requested.
 *
 * @return {[object]} array of object.
 * ex:
 * [
 *   {
 *     "status": "success",
 *     "idPatient": 7,
 *     "name": "Fulano da Silva e Santos"
 *   }
 * ]
 */
const getPatients = async (bearerToken, requestConfig) => {
  const flag = '{idPatient}';

  const { listToRequest, listToEscape, nameUrl, useCache } = requestConfig;

  const promises = await listToRequest.map(async ({ idPatient, birthdate }) => {
    if (listToEscape[idPatient] && useCache) {
      return listToEscape[idPatient];
    }

    const cache = moment().diff(birthdate, 'years') > 0;
    console.log('%cRequested patient of id: ', 'color: #e67e22;', idPatient, 'cache:', cache);  
    console.log('%cRequested patient of url: ', 'color: #e67e22;', nameUrl)
    const urlRequest = nameUrl.replace(flag, idPatient);

    try {  
      const { data: patient } = await axios.get(urlRequest, { timeout: 8000 });
      return { ...patient, cache };
    } catch (e) {
      return {
        idPatient,
        name: `Paciente ${idPatient}`,
        cache,
        status: 'success'
      };
    }
  });

  const patients = await Promise.all(promises);
  const previous = Object.keys(listToEscape).map(key => listToEscape[key]);

  return [...previous, ...patients];
};

const hospital = {
  getPatients
};

export default hospital;
