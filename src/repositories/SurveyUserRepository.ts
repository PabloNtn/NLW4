import { EntityRepository, Repository } from "typeorm";
import { SurveyUser } from "../models/surveyUser";

@EntityRepository(SurveyUser)
class SurveysUserRepository extends Repository<SurveyUser>{ }

export { SurveysUserRepository };