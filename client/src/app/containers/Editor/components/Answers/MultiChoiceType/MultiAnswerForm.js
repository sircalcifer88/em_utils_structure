// .......................................................

const validate = (values, props) => {
    //TODO after updating the answer form to be from one place for all types, update validate function
    const errors = {};
    let requiredFields = ['answerText', 'timeRangeType', 'message', 'score'];
    const {selectedQuestion} = props;
    if (!values.answers || !values.answers.length) {
        errors.answers = {_error: 'At least one answer must be entered'};
    } else {
        const answersArrayErrors = [];
        values.answers.forEach((answer, answerIndex) => {
            const answersTotalScore = values.answers.reduce((acc, item, itemIndex) =>
                acc + ((itemIndex !== answerIndex && item.timeRangeType === 1 && item.score ? +item.score : 0)), 0);
            const answerErrors = {};
            requiredFields.forEach(item => {
                if ((!answer[item] && answer[item] !== 0) || !answer[item].toString().replace(/\s/g, '').length) {
                    answerErrors[item] = `The ${REQUIRED_TYPE[item]} field is required.`;
                }
            });
            let score = +answer.score;
            if (answer.timeRangeType === 1) {
                if (score <= 0) {
                    answerErrors.score = 'Correct answer score can not be 0 or negative value.';
                } else if (score > +selectedQuestion.score - answersTotalScore) {
                    answerErrors.score = `Total available score is ${selectedQuestion.score}.`;
                }
            } else if (answer.timeRangeType !== 1) {
                const correctAnswers = values.answers.filter(answer => answer.timeRangeType === 1);
                if (!values.answers.length || !correctAnswers.length) {
                    answerErrors.timeRangeType = 'Please record correct answer first.';
                } else {
                    if (answer.timeRangeType === 3 && score < 0) {
                        answerErrors.score = 'Partially correct answer score can not be negative value.';
                    } else if (answer.timeRangeType === 2 && score > 0) {
                        answerErrors.score = 'Incorrect answer score can not be positive value.';
                    }
                    const minCorrectScore = +(correctAnswers.sort((a, b) => +a.score - +b.score)[0].score);
                    if (answer.timeRangeType === 3 && minCorrectScore && score > minCorrectScore) {
                        answerErrors.score = `Max score for partially correct answer must be no more than ${minCorrectScore}.`;
                    }
                }
            }
            answersArrayErrors[answerIndex] = answerErrors;
            return answerErrors;
        });
        if (answersArrayErrors.length) {
            errors.answers = answersArrayErrors;
        }
    }
    return errors;
};

// ..........................................................