import {useState, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import axiosInstance from '../utility/axiosInstance';
import {
  setDashboardData,
  setPieData,
  setProgressData,
} from '../store/reducer/dashboardReducer';

const useFetchDashboardData = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  console.log('UseFetchDashboardData Called');
  // const [pieData, setPieData] = useState([]);
  // const [progressData, setProgressData] = useState([]);

  const transformData = (results, colorMap, labelMap) => {
    return results.map((item, index) => ({
      key: index + 1,
      value: Math.floor((item.count / item.limit) * 100) || 0,
      svg: {fill: colorMap[item.id]},
      label: labelMap[item.id],
    }));
  };

  const generateDynamicMappings = results => {
    const colorPalette = [
      '#2A9A13',
      '#CFC825',
      '#3DB8AD',
      '#097EF2',
      '#B73737',
      '#8E44AD',
      '#F39C12',
      '#E74C3C',
      '#3498DB',
      '#27AE60',
      '#6C3483',
      '#1ABC9C',
    ];

    const colorMap = {};
    const labelMap = {};

    results.forEach((item, index) => {
      colorMap[item.id] = colorPalette[index % colorPalette?.length];
      labelMap[item.id] = item.title;
    });

    return {colorMap, labelMap};
  };

  useEffect(() => {
    setIsLoading(true);
    axiosInstance
      .get('/progress/myprogress')
      .then(res => {
        const {results} = res.data;
        dispatch(setProgressData(results));
        const data = [
          {
            key: 1,
            value: 100 - res?.data?.metrics?.overallPercentageAllItems,
            svg: {fill: '#3498DB'},
            label: 'Incomplete',
          },
          {
            key: 2,
            value: res?.data?.metrics?.overallPercentageAllItems,
            svg: {fill: '#27AE60'},
            label: 'Overall Progress',
          },
        ];
        dispatch(setPieData(data));

        setIsLoading(false);
      })
      .catch(error => {
        console.log('Error:', JSON.stringify(error, null, 1));
        setIsLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setIsLoading(true);
    axiosInstance
      .post('/dashboard/portal', {
        familyMember: {},
        lastPasswordUpdate: {},
        review: {},
        template: {},
        community: {},
        message: {},
        // dayToday: { timeFrame: dayToDay },
        myDocument: {},
        documentLab: {},
        calendar: {},
        assignment: {},
        showTell: {},
        bootcamp: {},
      })
      .then(res => {
        if (res.data.success) {
          dispatch(setDashboardData(res.data.data));
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  }, [dispatch]);

  return {isLoading};
};

export default useFetchDashboardData;
