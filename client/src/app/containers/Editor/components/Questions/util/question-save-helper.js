import {callAfterRender} from 'app/utils/callAfterRender';

export const handleSaveChallenge = async (
    isRecordProcess,
    isQuestionFormValid,
    isMultiChoiceType,
    isMultiChoiceFormValid,
    submitForm,
    recordStatusChange,
) => {
    if (isQuestionFormValid) {
        if (isMultiChoiceType) {
            await submitForm('answersArrayForm');
        }
        if (isRecordProcess && isMultiChoiceType ? isMultiChoiceFormValid : true) {
            recordStatusChange(false);
            callAfterRender(() => submitForm('question'));
        }
    } else {
        submitForm('question');
    }
};