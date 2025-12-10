import { Exam } from '../types/exams';
import { Result } from '../types/global';

interface LocalExamData {
  examData: Exam[];
  lastUpdated: Date;
}

const getExamDataFromLocal = (): Result<LocalExamData> => {
  const localData = localStorage.getItem('exams');

  if (!localData) {
    return {
      success: false,
      errorMessage: 'No exams data found in local storage',
    };
  }

  const parsedData: LocalExamData = JSON.parse(localData);

  return {
    success: true,
    data: { ...parsedData, lastUpdated: new Date(parsedData.lastUpdated) },
  };
};

const getExamData = async (): Promise<Result<Exam[]>> => {
  try {
    const localDataResult = getExamDataFromLocal();

    if (localDataResult.success) {
      const ONE_MINUTE = 1 * 60 * 1000; // 1 minute in milliseconds
      const now = new Date();
      const lastUpdated = new Date(localDataResult.data.lastUpdated); // ensure it's a Date

      if (now.getTime() - lastUpdated.getTime() < ONE_MINUTE) {
        console.log('Exams: using local data (updated every minute)');
        return {
          success: true,
          data: localDataResult.data.examData,
        };
      }
    }

    console.log('Exams: fetching new data');

    const url = process.env.REACT_APP_EXAMS_URL;
    const accessToken = process.env.REACT_APP_SUPABASE_ANON_KEY;

    if (!url || !accessToken) {
      throw new Error('EXAMS_URL or SUPABASE_ANON_KEY is not defined');
    }

    const response = await fetch(url, {
      headers: {
        Authorization: 'Bearer ' + accessToken,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Exams: fetched new data successfully');

    localStorage.setItem(
      'exams',
      JSON.stringify({ examData: data, lastUpdated: new Date() })
    );

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Failed to fetch exam data:', error);
    return {
      success: false,
      errorMessage: 'Failed to fetch exam data',
    };
  }
};

export default getExamData;
