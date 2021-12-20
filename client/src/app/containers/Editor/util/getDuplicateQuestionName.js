export const getDuplicateQuestionName = (duplicatedQuestionName, questionList) => {
    /**
     * finds if there are already copies of the question which is being duplicated
     * and if there are finds the latest copied one and based on this generates new name for duplicated question.
     * @duplicatedQuestionName name of question which is being duplicated
     * @questionList all questions of currentLesson
     **/
    const copyNumberRegex = new RegExp(' - Copy\\(([1-9]\\d*)\\)$');
    const originalName = duplicatedQuestionName.replace(copyNumberRegex, '');
    const escapedOriginalName = originalName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const prevCopied = questionList.filter(item => new RegExp(`${escapedOriginalName} - Copy\\([1-9]\\d*\\)$`).test(item.name))
        .sort((a, b) => b.name.match(copyNumberRegex)[1] - a.name.match(copyNumberRegex)[1]);
    const copyNumber = prevCopied[0] ? +(prevCopied[0].name.match(copyNumberRegex)[1]) + 1 : 1;
    return originalName + ` - Copy(${copyNumber})`;
};


export const getNewQuestionOrder = (questionList) => {
    /**
     * finds max order in existing questions + 1
     */
    let maxOrder = null;
    questionList.forEach(question => {
        if (question.order > maxOrder) {
            maxOrder = question.order;
        }
    });
    return questionList.length !== 0 ? maxOrder + 1 : 0;
};