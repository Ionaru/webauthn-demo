/* eslint-disable */

export const AllTypesProps: Record<string,any> = {
	AuthenticatorAssertionResponseDTO:{

	},
	AuthenticatorAttestationResponseDTO:{

	},
	Mutation:{
		addUserCredential:{
			response:"AuthenticatorAttestationResponseDTO",
			user:"UserDTO"
		},
		loginUser:{
			response:"AuthenticatorAssertionResponseDTO"
		},
		registerUser:{
			response:"AuthenticatorAttestationResponseDTO",
			user:"UserDTO"
		}
	},
	UserDTO:{

	}
}

export const ReturnTypes: Record<string,any> = {
	Mutation:{
		addUserCredential:"Boolean",
		createChallenge:"String",
		loginUser:"String",
		logoutUser:"Boolean",
		registerUser:"Boolean"
	},
	Query:{
		secret:"String",
		session:"SessionDTO"
	},
	SessionDTO:{
		user:"String",
		userId:"String"
	}
}

export const Ops = {
query: "Query" as const,
	mutation: "Mutation" as const
}