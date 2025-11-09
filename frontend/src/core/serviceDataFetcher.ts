import { Result } from '../types/global';
import { ServiceData } from '../types/serviceData';

interface LocalServiceData {
  serviceData: ServiceData;
  lastUpdated: Date;
}

const getServiceDataFromLocal = (): Result<LocalServiceData> => {
  const localData = localStorage.getItem('serviceData');

  if (!localData) {
    return {
      success: false,
      errorMessage: 'No announcements data found in local storage',
    };
  }

  const parsedData: LocalServiceData = JSON.parse(localData);

  return {
    success: true,
    data: { ...parsedData, lastUpdated: new Date(parsedData.lastUpdated) },
  };
};

const getServiceData = async (): Promise<Result<ServiceData>> => {
  try {
    const localDataResult = getServiceDataFromLocal();

    if (localDataResult.success) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      if (localDataResult.success) {
        const ONE_MINUTE = 1 * 60 * 1000; // 1 minute in milliseconds
        const now = new Date();
        const lastUpdated = new Date(localDataResult.data.lastUpdated); // ensure it's a Date

        if (now.getTime() - lastUpdated.getTime() < ONE_MINUTE) {
          console.log('Service Data: using local data (updated every minute)');
          return {
            success: true,
            data: localDataResult.data.serviceData,
          };
        }
      }
    }

    console.log('ServiceData: fetching new data');

    const url = process.env.REACT_APP_SERVICEDATA_URL;
    const accessToken = process.env.REACT_APP_SUPABASE_ANON_KEY;

    if (!url || !accessToken) {
      throw new Error('SERVICEDATA_URL or SUPABASE_ANON_KEY is not defined');
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

    localStorage.setItem(
      'serviceData',
      JSON.stringify({ serviceData: data, lastUpdated: new Date() })
    );

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Failed to fetch serviceData:', error);
    return {
      success: false,
      errorMessage: 'Failed to fetch upcoming serviceData',
    };
  }
};

export default getServiceData;
