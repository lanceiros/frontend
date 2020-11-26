import { format } from 'date-fns';

import { uniqBy } from '@utils/lodash';
import moment from 'moment';
import {
  groupSolutions,
  groupProcedures,
  filterWhitelistedChildren,
  getWhitelistedChildren
} from '@utils/transformers/prescriptionDrugs';
import { stringify, formatAge } from './utils';
import { toDataSource } from '@utils';

/**
 * group by Prescription
 * @param {*} list
 * @param {*} prescriptionType
 * @param {*} groupFunction
 * @param {*} extraContent
 */
const groupByPrescription = (list, prescriptionType, groupFunction, infusionList, extraContent) => {
  const drugArray = [];
  list.forEach(item => {
    if (!drugArray[item.idPrescription]) {
      drugArray[item.idPrescription] = [];
    }
    drugArray[item.idPrescription].push(item);
  });

  const dsArray = [];
  drugArray.forEach((item, index) => {
    if (groupFunction) {
      dsArray.push({
        key: index,
        value: groupFunction(
          toDataSource(item, 'idPrescriptionDrug', {
            prescriptionType,
            ...extraContent
          }),
          infusionList
        )
      });
    } else {
      dsArray.push({
        key: index,
        value: toDataSource(item, 'idPrescriptionDrug', {
          prescriptionType,
          ...extraContent
        })
      });
    }
  });

  return dsArray;
};

export const transformDrug = ({ dose, measureUnit, route, ...drug }) => ({
  ...drug,
  dose,
  measureUnit,
  dosage: `${dose} ${measureUnit.value}`,
  route
});

export const transformPrescription = ({
  daysAgo,
  prescriptionScore,
  date,
  expire,
  birthdate,
  mdrd,
  tgo,
  tgp,
  patientScore,
  prescription,
  solution,
  procedures,
  namePatient,
  idPrescription,
  dischargeDate,
  infusion,
  ...item
}) => ({
  ...item,
  daysAgo,
  daysAgoString: `${daysAgo} dia(s)`,
  prescriptionScore,
  prescriptionRisk: stringify([prescriptionScore]),
  date,
  dateFormated: format(new Date(date), 'dd/MM/yyyy HH:mm'),
  dateOnlyFormated: format(new Date(date), 'dd/MM/yyyy'),
  expire,
  expireFormated: expire ? format(new Date(expire), 'dd/MM/yyyy HH:mm') : '',
  dischargeFormated: dischargeDate ? format(new Date(dischargeDate), 'dd/MM/yyyy HH:mm') : '',
  shortDateFormat: format(new Date(date), 'dd/MM'),
  birthdate,
  age: birthdate ? formatAge(birthdate) : '',
  birthdays: birthdate ? moment().diff(birthdate, 'day') : '',
  mdrd,
  tgo,
  tgp,
  patientScore,
  patientRisk: stringify([mdrd, tgo, tgp, patientScore], ' 0 '),
  prescription: prescription
    ? groupByPrescription(
        filterWhitelistedChildren(prescription.map(transformDrug)),
        'prescriptions',
        null,
        null,
        {
          whitelistedChildren: getWhitelistedChildren(prescription)
        }
      )
    : [],
  solution: solution
    ? groupByPrescription(solution.map(transformDrug), 'solutions', groupSolutions, infusion)
    : [],
  procedures: procedures
    ? groupByPrescription(procedures.map(transformDrug), 'procedures', groupProcedures)
    : [],
  namePatient,
  idPrescription,
  slug: idPrescription,
  infusion,
  prescriptionRaw: prescription,
  solutionRaw: solution,
  proceduresRaw: procedures
});

export const transformPrescriptions = prescriptions => prescriptions.map(transformPrescription);

export const getUniqueDrugs = (prescriptions, solutions, procedures) => {
  const drugs = [];
  const add = ({ idDrug, drug }) => drugs.push({ idDrug, name: drug });

  if (prescriptions) prescriptions.forEach(item => add(item));
  if (solutions) solutions.forEach(item => add(item));
  if (procedures) procedures.forEach(item => add(item));

  return uniqBy(drugs, 'idDrug').sort((a, b) => {
    if (a.drug > b.drug) return 1;
    if (a.drug < b.drug) return -1;
    return 0;
  });
};

export const transformExams = exams =>
  Object.keys(exams).map(key => {
    const obj = exams[key];
    return { ...obj, key };
  });
