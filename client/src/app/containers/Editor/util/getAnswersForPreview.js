import _ from 'lodash';
import {nanoid} from 'nanoid';
import {getClipIdForTrimQuestion} from '../components/TimeLine/utils/trimQuestionHelpers';
import {configService} from 'Services/app';

export const getAnswersForPreview = (userAnswers, allAnswers, questionType, timelineClips, playlistDuration) => {
    let markedAnswers = userAnswers ? JSON.parse(JSON.stringify(userAnswers)) : [];
    const isMarkerType = questionType === configService.questionTypes.MARKER.value;
    const isDeleteType = questionType === configService.questionTypes.DELETE.value;
    const isTrimType = questionType === configService.questionTypes.TRIM.value;
    const isMultiChoiceType = questionType === configService.questionTypes.MULTICHOICE.value;
    const isAdvancedMultiChoiceType = questionType === configService.questionTypes.ADVANCED_MULTI_CHOICE.value;
    
    if (isAdvancedMultiChoiceType || isMultiChoiceType) {
        return allAnswers.map(item => ({...item, isNotUserAnswer: !markedAnswers.map(answer => answer.id).includes(item.id)}));
    }

    let notMarkedAnswers = [];
    _.cloneDeep(allAnswers).forEach(item => {
        const isSame = markedAnswers.find(elem => {
            let result = false;
            if (isMarkerType) {
                result = item.start <= elem.point && elem.point < item.end;
            } else if (isDeleteType) {
                result = elem.clip.clipId === item.clipId;
            } else if (isTrimType) {
                const sameType = item.trimType === elem.trimType;
                const sameTrimOptionLengths = item.trimOptions.length === elem.clip.trimOptions.length;
                result = sameType && sameTrimOptionLengths;
                if (result) {
                    item.trimOptions.forEach(questionAnswerTrimOption => {
                        const optionInQuestionAnswer = elem.clip.trimOptions.find(userAnswerOption => (
                            userAnswerOption.clipId === questionAnswerTrimOption.clipId && userAnswerOption.isLeftDirection === questionAnswerTrimOption.isLeftDirection &&
                            questionAnswerTrimOption.start <= userAnswerOption.point && userAnswerOption.point < questionAnswerTrimOption.end
                        ));
                        if (!optionInQuestionAnswer) {
                            result = false;
                        }
                    });
                }
            }
            return result;
        });
        if (!isSame) {
            if (isMarkerType) {
                if (playlistDuration >= item.start + item.duration) {
                    item.point = item.start + item.duration / 2;
                } else {
                    item.point = null;
                }
            } else if (isDeleteType) {
                item.clip = timelineClips.find(elem => (item.clip ? item.clip.clipId : item.clipId) === (elem.groupId || elem.timelineItemId));
            } else if (isTrimType) {
                const itemClips = timelineClips.filter(elem => {
                    const {trimOptions} = item;
                    return trimOptions.find(option => getClipIdForTrimQuestion(item, elem) === option.clipId);
                });
                item.clipData = itemClips.length ? itemClips : null;
            }
            if (isDeleteType && item.clip || isMarkerType && item.point || isTrimType && item.clipData) {
                item.isNotUserAnswer = true;
                notMarkedAnswers.push(item);
            }
        }
    });
    if (isMarkerType) {
        markedAnswers.forEach(elem => {
            if (!elem.isNotMarkedPoint) {
                const answer = allAnswers.find(item => item.start <= elem.point && (playlistDuration === item.end ? elem.point <= item.end : elem.point < item.end));
                elem.start = answer.start;
            }
        });
        notMarkedAnswers.sort((a, b) => a.start - b.start);
    } else if (isDeleteType) {
        notMarkedAnswers.sort((a, b) => a.clip.start - b.clip.start);
        markedAnswers = markedAnswers.filter(item => timelineClips.find(elem => item.clip.clipId === (elem.groupId || elem.timelineItemId)))
            .map(item => {
                const timelineClip = timelineClips.find(elem => item.clip.clipId === (elem.groupId || elem.timelineItemId));
                item.clip.start = timelineClip.start;
                item.clip.end = timelineClip.end;
                return item;
            });
    } else if (isTrimType) {
        notMarkedAnswers.sort((a, b) => a.clipData.start - b.clipData.start);
        markedAnswers = markedAnswers.filter(item => {
            const {trimOptions} = item.clip;
            const optionsInTimeline = trimOptions.filter(option => timelineClips.find(timelineClip => getClipIdForTrimQuestion(item.clip, timelineClip) === option.clipId));
            return optionsInTimeline.length === trimOptions.length;
        })
            .map(item => {
                item.clipData = timelineClips.filter(elem => {
                    const {trimOptions} = item.clip;
                    return trimOptions.find(option => getClipIdForTrimQuestion(item.clip, elem) === option.clipId);
                });
                return item;
            });
    }
    const answers = markedAnswers.concat(notMarkedAnswers);
    return answers.length ? answers : false;
};

export const getStudentAnswersForPreview = (userAnswers, allAnswers, questionType, timelineClips) => {
    const isMultiChoiceType = questionType === configService.questionTypes.MULTICHOICE.value;
    const isAdvancedMultiChoiceType = questionType === configService.questionTypes.ADVANCED_MULTI_CHOICE.value;
    const isDeleteType = questionType === configService.questionTypes.DELETE.value;
    const isTrimType = questionType === configService.questionTypes.TRIM.value;
    if (isMultiChoiceType) {
        return allAnswers.map(item => ({...item, isNotUserAnswer: !userAnswers.map(answer => answer.id).includes(item.id)}));
    }
    if (isAdvancedMultiChoiceType) {
        return allAnswers.map(item => ({...item, isNotUserAnswer: !userAnswers.map(answer => answer.id).includes(item.id)}));
    }
    if(isDeleteType) {
        return userAnswers.map(item => {
            const timelineClip = timelineClips.find(elem => item.clip.clipId === (elem.groupId || elem.timelineItemId));
            const start = timelineClip.start;
            const end = timelineClip.end;
            const clipId = item.clip.clipId;
            const newItem = {
                id: nanoid(),
                ...item,
                clip: {...item.clip, start, end},
                clipId
            };
            return newItem;
        });
    }
    if(isTrimType) {
        return userAnswers.filter(item => {
            const {trimOptions} = item.clip;
            const optionsInTimeline = trimOptions.filter(option => timelineClips.find(timelineClip => getClipIdForTrimQuestion(item.clip, timelineClip) === option.clipId));
            return optionsInTimeline.length === trimOptions.length;
        })
            .map(item => {
                const clipData = timelineClips.filter(elem => {
                    const {trimOptions} = item.clip;
                    return trimOptions.find(option => getClipIdForTrimQuestion(item.clip, elem) === option.clipId);
                });
                const trimOptions = item.clip && item.clip.trimOptions;
                return {...item, clipData, trimOptions};
            });
    }
    return userAnswers.map(item => ({id: nanoid(), ...item}));
};