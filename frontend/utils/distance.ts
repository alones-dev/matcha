function convertRad(n: number): number{
    return (Math.PI * n) / 180;
}

export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; 

    lat1 = convertRad(lat1);
    lat2 = convertRad(lat2);
    const dLat = convertRad(lat2 - lat1);
    const dLon = convertRad(lon2 - lon1);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;

    return Math.round(distance * 100) / 100;
}