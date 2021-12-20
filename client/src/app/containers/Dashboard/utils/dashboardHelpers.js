export const sortData = (data, sortOptions) => {
    const sortedData = data.sort((x, y) => {
        const xAttempt = x.attempts.find(attempt => sortOptions.id === attempt.lessonId);
        const yAttempt = y.attempts.find(attempt => sortOptions.id === attempt.lessonId);
        const xScore = xAttempt ? xAttempt.isComplete ? (xAttempt.score ? xAttempt.score : 0) : 1 : 0;
        const yScore = yAttempt ? yAttempt.isComplete ? (yAttempt.score ? yAttempt.score : 0) : 1 : 0;
        return sortOptions.sortDir === 'asc' ?
            xScore > yScore ? 1 : yScore > xScore ? -1 : 0 :
            xScore > yScore ? -1 : yScore > xScore ? 1 : 0;
    });
    return sortedData;
};