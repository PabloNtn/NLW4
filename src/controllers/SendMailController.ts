import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveysRepository } from "../repositories/SurveysRepository";
import { SurveysUserRepository } from "../repositories/SurveyUserRepository";
import { UsersRepository } from "../repositories/UserRepository";
import SendMailService from "../services/SendMailService";
import { resolve } from 'path';

class SendMailController {

    async execute(request: Request, response: Response) {
        const { email, survey_id } = await request.body;

        const usersRepository = getCustomRepository(UsersRepository);
        const surveyRepository = getCustomRepository(SurveysRepository);
        const surveyUserRepository = getCustomRepository(SurveysUserRepository);

        const user = await usersRepository.findOne({ email });



        if (!user) {
            return response.status(400).json({
                error: "User does not exists"
            })
        }

        const survey = await surveyRepository.findOne({ id: survey_id })

        if (!survey) {
            return response.status(400).json({
                error: "Survey does not exists"
            });
        };

        const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");

        const surveyUserAlreadyExists = await surveyUserRepository.findOne({
            where: { user_id: user.id, value: null },
            relations: ["user", "survey"]
        });

        const variables = {
            name: user.name,
            titulo: survey.titulo,
            description: survey.description,
            id: "",
            link: process.env.URL_MAIL
        };

        if (surveyUserAlreadyExists) {
            variables.id = surveyUserAlreadyExists.id;
            await SendMailService.execute(email, survey.titulo, variables, npsPath);
            return response.json(surveyUserAlreadyExists);
        }

        //Salvar dados na tabela SurveyUser

        const surveyUser = surveyUserRepository.create({
            user_id: user.id,
            survey_id
        })

        await surveyUserRepository.save(surveyUser);

        //Enviar e-mail para usuario
        variables.id = surveyUser.id;

        await SendMailService.execute(email, survey.titulo, variables, npsPath);

        return response.json(surveyUser)
    }

}

export { SendMailController };