import UserRepository from './user.repository';



export class UserService {
    constructor(private readonly UserRepository:UserRepository){
    }


    async findUserByPhone(phone:string){
        return await this.UserRepository.findOne({where:{phone:phone}})
        
    }
}
