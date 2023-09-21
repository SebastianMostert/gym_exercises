import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import { Box } from "@mui/material";


import { fetchData, fetchExercises, fetchExercisesByEquipment, fetchExercisesByID, fetchExercisesByTargetGroup, youtubeOptions } from "../utils/fetchData";
import Detail from '../components/Detail';
import ExerciseVideos from '../components/ExerciseVideos';
import SimilarExercises from '../components/SimilarExercises';

const ExerciseDetail = () => {
  const [exerciseDetail, setExerciseDetail] = useState({});
  const [exerciseVideos, setExerciseVideos] = useState([]);
  const [targetMuscleExercises, setTargetMuscleExercises] = useState([])
  const [equipmentExercises, setEquipmentExercises] = useState([])

  const { id } = useParams();

  useEffect(() => {
    const fetchExercisesData = async () => {
      const youtubeSearchUrl = `https://youtube-search-and-download.p.rapidapi.com`

      const exerciseDetailData = await fetchExercisesByID({ id })
      const exerciseVideosData = await fetchData(`${youtubeSearchUrl}/search?query=${exerciseDetailData.name}%20Exercise`, youtubeOptions)
      const targetMuscleExercisesData = await fetchExercisesByTargetGroup({ targetGroup: exerciseDetailData.target })
      const equipmentExercisesData = await fetchExercisesByEquipment({ equipment: exerciseDetailData.equipment })
      
      setExerciseDetail(exerciseDetailData)
      setExerciseVideos(exerciseVideosData.contents)
      setTargetMuscleExercises(targetMuscleExercisesData);
      setEquipmentExercises(equipmentExercisesData)
    }

    fetchExercisesData()
  }, [id])

  return (
    <Box>
      <Detail exerciseDetail={exerciseDetail} />
      <ExerciseVideos exerciseVideos={exerciseVideos} name={exerciseDetail.name} />
      <SimilarExercises targetMuscleExercises={targetMuscleExercises} equipmentExercises={equipmentExercises} />
    </Box>
  )
}

export default ExerciseDetail
