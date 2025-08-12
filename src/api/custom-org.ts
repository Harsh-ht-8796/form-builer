import { MutationFunction, QueryClient, useMutation, UseMutationOptions, UseMutationResult } from "@tanstack/react-query";
import { CreateOrganizationRequest } from "@/api/org/model/createOrganizationRequest";
import { OrganizationResponse } from "@/api/org/model/organizationResponse";
import customInstance, { ErrorType } from "@/api/org/mutator/custom-org-instance";


/**
 * Creates a new organization with name and locality.
 * @summary Create a new organization
 */
export const postApiV1OrganizationsMapToUser = (
    createOrganizationRequest: CreateOrganizationRequest,
    signal?: AbortSignal,
) => {
    return customInstance<OrganizationResponse>({
        url: `/api/v1/organizations/map-to-user`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: createOrganizationRequest,
        signal,
        
    });
};

export const getPostApiV1OrganizationsMapToUserMutationOptions = <
    TError = ErrorType<null | null>,
    TContext = unknown,
>(options?: {
    mutation?: UseMutationOptions<
        Awaited<ReturnType<typeof postApiV1OrganizationsMapToUser>>,
        TError,
        { data: CreateOrganizationRequest },
        TContext
    >;
}): UseMutationOptions<
    Awaited<ReturnType<typeof postApiV1OrganizationsMapToUser>>,
    TError,
    { data: CreateOrganizationRequest },
    TContext
> => {
    const mutationKey = ["postApiV1OrganizationsMapToUser"];
    const { mutation: mutationOptions } = options
        ? options.mutation &&
            "mutationKey" in options.mutation &&
            options.mutation.mutationKey
            ? options
            : { ...options, mutation: { ...options.mutation, mutationKey } }
        : { mutation: { mutationKey } };

    const mutationFn: MutationFunction<
        Awaited<ReturnType<typeof postApiV1OrganizationsMapToUser>>,
        { data: CreateOrganizationRequest }
    > = (props) => {
        const { data } = props ?? {};

        return postApiV1OrganizationsMapToUser(data);
    };

    return { mutationFn, ...mutationOptions };
};

export type PostApiV1OrganizationsMutationResult = NonNullable<
    Awaited<ReturnType<typeof postApiV1OrganizationsMapToUser>>
>;
export type PostApiV1OrganizationsMapToUserMutationBody = CreateOrganizationRequest;
export type PostApiV1OrganizationsMapToUserMutationError = ErrorType<null | null>;

/**
 * @summary Create a new organization
 */
export const usePostApiV1OrganizationsMapToUser = <
    TError = ErrorType<null | null>,
    TContext = unknown,
>(
    options?: {
        mutation?: UseMutationOptions<
            Awaited<ReturnType<typeof postApiV1OrganizationsMapToUser>>,
            TError,
            { data: CreateOrganizationRequest },
            TContext
        >;
    },
    queryClient?: QueryClient,
): UseMutationResult<
    Awaited<ReturnType<typeof postApiV1OrganizationsMapToUser>>,
    TError,
    { data: CreateOrganizationRequest },
    TContext
> => {
    const mutationOptions = getPostApiV1OrganizationsMapToUserMutationOptions(options);

    return useMutation(mutationOptions, queryClient);
};
