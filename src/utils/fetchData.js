import { bodyPartsDataCache, exercisesDataCache } from "./storage";
const defaultFromStorage = true;

/**
 * @typedef {object} ExerciseObject 
 * @property {string} bodyPart
 * @property {string} equipment
 * @property {string} gifUrl
 * @property {string} id
 * @property {string} name
 * @property {string} target
 */

export const exerciseOptions = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
    'X-RapidAPI-Key': process.env.REACT_APP_RAPID_API_KEY,
  },
};

export const youtubeOptions = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': process.env.REACT_APP_RAPID_API_KEY,
    'X-RapidAPI-Host': 'youtube-search-and-download.p.rapidapi.com'
  }
};

/**
 * Time Complexity -> O(1)
 * 
 * @param {string} url 
 * @param {object} options 
 * @returns {Promise<object[] | string[]>}
 */
export const fetchData = async (url, options) => {
  const response = await fetch(url, options);
  const data = await response.json();
  
  return data;
}

/**
 * Time Complexity -> O(1)
 * 
 * @param {object} options The options object
 * @param {boolean} options.fromStorage Wether or not the data can be fetched from the local storage
 * @returns {Promise<string[]>}
 */
export const fetchBodyParts = async (options) => {
  let fromStorage = options && options?.fromStorage;
  if (fromStorage === undefined) fromStorage = defaultFromStorage;

  let bodyPartsData;

  if (bodyPartsDataCache.length === 0 || !fromStorage) {
    console.log("Fetching from Api....")
    bodyPartsData = await fetchData('https://exercisedb.p.rapidapi.com/exercises/bodyPartList', exerciseOptions);
    bodyPartsDataCache.push(bodyPartsData)
  } else {
    console.log("Fetching from Storage....")
    bodyPartsData = bodyPartsDataCache;
  }

  return bodyPartsData;
}

/**
 * Time Complexity -> O(1)
 * 
 * @param {object} options The options object
 * @param {boolean} options.fromStorage Wether or not the data can be fetched from the local storage
 * @returns {Promise<ExerciseObject[]>}
 */
export const fetchExercises = async (options) => {
  let fromStorage = options && options?.fromStorage;
  if (fromStorage === undefined) fromStorage = defaultFromStorage;

  let exercisesData;

  if (exercisesDataCache.length === 0 || !fromStorage) {
    console.log("Fetching from Api....")
    exercisesData = await fetchData('https://exercisedb.p.rapidapi.com/exercises', exerciseOptions);
    exercisesDataCache.push(exercisesData)
  } else {
    console.log("Fetching from Storage....")
    exercisesData = exercisesDataCache;
  }

  return exercisesData;
}

/**
 * Time Complexity -> O(n)
 * 
 * @param {object} options The options object
 * @param {boolean} options.fromStorage Wether or not the data can be fetched from the local storage
 * @param {string} options.bodyPart The bodypart
 * @returns {Promise<ExerciseObject[]>}
 */
export const fetchExercisesByBodyPart = async (options) => {
  let bodyPart = options && options?.bodyPart;
  let fromStorage = options && options?.fromStorage;
  if (fromStorage === undefined) fromStorage = defaultFromStorage;
  if (bodyPart === undefined) bodyPart = 'all';

  let allExercisesData = await fetchExercises({ fromStorage });
  let exercisesData = [];

  if (bodyPart === 'all') exercisesData = allExercisesData;
  else {
    for (let i = 0; i < allExercisesData.length; i++) {
      const exerciseData = allExercisesData[i];
      if (exerciseData.bodyPart.toLowerCase() === bodyPart) exercisesData.push(exerciseData)
    }
  }


  return exercisesData;
}

/**
 * Time Complexity -> O(n)
 * 
 * @param {object} options The options object
 * @param {boolean} options.fromStorage Wether or not the data can be fetched from the local storage
 * @param {string} options.id The id
 * @returns {Promise<ExerciseObject>}
 */
export const fetchExercisesByID = async (options) => {
  let fromStorage = options && options?.fromStorage;
  if (fromStorage === undefined) fromStorage = defaultFromStorage;
  const { id } = options;

  let allExercisesData = await fetchExercises({ fromStorage });
  let exercisesData;

  for (const obj of allExercisesData) {
    if (obj.id === id) {
      return exercisesData = obj
    }
  }
  return exercisesData;
}

/**
 * Time Complexity -> O(n)
 * 
 * @param {object} options The options object
 * @param {boolean} options.fromStorage Wether or not the data can be fetched from the local storage
 * @param {string} options.targetGroup The target Group
 * @returns {Promise<ExerciseObject[]>}
 */
export const fetchExercisesByTargetGroup = async (options) => {
  let fromStorage = options && options?.fromStorage;
  if (fromStorage === undefined) fromStorage = defaultFromStorage;
  const { targetGroup } = options;

  let allExercisesData = await fetchExercises({ fromStorage });
  let exercisesData = [];

  for (const obj of allExercisesData) {
    if (obj.target === targetGroup) {
      exercisesData.push(obj)
    }
  }
  return exercisesData;
}

/**
 * Time Complexity -> O(n)
 * 
 * @param {object} options The options object
 * @param {boolean} options.fromStorage Wether or not the data can be fetched from the local storage
 * @param {string} options.equipment The equipment
 * @returns {Promise<ExerciseObject[]>}
 */
export const fetchExercisesByEquipment = async (options) => {
  let fromStorage = options && options?.fromStorage;
  if (fromStorage === undefined) fromStorage = defaultFromStorage;
  const { equipment } = options;

  let allExercisesData = await fetchExercises({ fromStorage });
  let exercisesData = [];

  for (const obj of allExercisesData) {
    if (obj.equipment === equipment) {
      exercisesData.push(obj)
    }
  }
  return exercisesData;
}


