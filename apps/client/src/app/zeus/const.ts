/* eslint-disable */

export const AllTypesProps: Record<string,any> = {
	AuthenticatorAssertionResponseDTO:{

	},
	AuthenticatorAttestationResponseDTO:{

	},
	Mutation:{
		addUserCredential:{
			response:"AuthenticatorAttestationResponseDTO"
		},
		loginUser:{
			response:"AuthenticatorAssertionResponseDTO"
		},
		registerUser:{
			response:"AuthenticatorAttestationResponseDTO"
		}
	}
}

export const ReturnTypes: Record<string,any> = {
	Mutation:{
		addUserCredential:"Boolean",
		createChallenge:"String",
		loginUser:"Boolean",
		logoutUser:"Boolean",
		registerUser:"Boolean"
	},
	Query:{
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