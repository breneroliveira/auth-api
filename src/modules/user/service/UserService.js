import UserRepository from "../repository/UserRepository.js";
import * as HttpStatus from "../../../config/constants/HttpStatus.js";

class UserService {
    async findByEmail(req) {
        try {
            const { email } = req.params;
            this.validateRequestData(email);
            let user = UserRepository.findByEmail(email);
            if (!user) {
                
            }
            return {
                status: HttpStatus.SUCCESS,
                user: {
                    id: user.id,
                    id: user.nome,
                    id: user.email
                },
            };
        } catch (err) {
            return {
                status: err.status ? err.status : HttpStatus.INTERNAL_SERVER_ERROR,
                message: err.status
            };
        }
    }

    validarDadosRequisicao() {
        if (!email) {
            throw new Error("User email was not informed.");
        }
    }
}

export default UserService();