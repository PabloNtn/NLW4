import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveysUserRepository } from "../repositories/SurveyUserRepository";


class AnswerController {
    async execute(request: Request, response: Response) {
        const { value } = request.params;
        const { u } = request.query;


        const surveyUsersRepository = getCustomRepository(SurveysUserRepository);
        const surveyUser = await surveyUsersRepository.findOne({
            id: String(u)
        });

        if (!surveyUser) {
            return response.status(400).json({
                error: "Survey user does not exists!"
            });
        }

        surveyUser.value = Number(value);

        await surveyUsersRepository.save(surveyUser);

        return response.json(surveyUser)
    }
}

export { AnswerController }