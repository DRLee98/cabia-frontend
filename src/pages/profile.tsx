import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import React from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import { Loading } from "../components/loading";
import { Container, Image } from "../components/styledComponent";
import { siteName } from "../constants";
import { USER_FRAGMENT } from "../fragments";
import { useMe } from "../hooks/useMe";
import { UserRole } from "../__generated__/globalTypes";
import { UserFragment } from "../__generated__/UserFragment";
import { userProfileQuery } from "../__generated__/userProfileQuery";

const ProfileBox = styled.section`
  display: grid;
  grid-template-columns: 1fr 3fr;
  padding: 5em 0;
`;

const SideBox = styled.aside`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ContentsBox = styled.main`
  padding: 0 3em;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Name = styled.strong`
  font-size: 40px;
  margin-bottom: 0.5rem;
`;

const Email = styled.small`
  font-size: 15px;
  color: lightseagreen;
  margin-bottom: 1.2rem;
`;

const Role = styled.span`
  font-size: 20px;
  width: fit-content;
  padding: 0.5rem 1rem;
  border: 1px solid;
  border-radius: 999px;
  border-color: ${(props) => props.theme.signatureColor};
  color: ${(props) => props.theme.signatureColor};
  margin-right: 1rem;
`;

const SLink = styled(Link)`
  font-size: 20px;
  width: fit-content;
  padding: 0.5rem 1rem;
  border: 1px solid;
  border-radius: 999px;
  border-color: ${(props) => props.theme.disableColor};
  color: ${(props) => props.theme.disableColor};
  transition: all 0.5s ease;
  &:hover {
    border-color: ${(props) => props.theme.signatureColor};
    color: ${(props) => props.theme.signatureColor};
  }
`;

const Box = styled.div`
  display: flex;
  margin-top: 1.5rem;
`;

const Address = styled.p`
  font-size: 18px;
  color: gray;
`;

const USER_PROFILE_QUERY = gql`
  query userProfileQuery($input: UserProfileInput!) {
    userProfile(input: $input) {
      ok
      error
      user {
        ...UserFragment
      }
    }
  }
  ${USER_FRAGMENT}
`;

interface ProfileParam {
  id: string;
}

interface MyProfileProp {
  user: UserFragment | null | undefined;
}

export const Profile = () => {
  const { id } = useParams<ProfileParam>();
  const { loading, data } = useQuery<userProfileQuery>(USER_PROFILE_QUERY, {
    variables: { input: { id: +id } },
  });

  const user = data?.userProfile.user;

  return loading ? (
    <Loading />
  ) : (
    <>
      <Helmet>
        <title>{siteName} | 회원정보</title>
      </Helmet>
      <Container>
        <ProfileBox>
          <SideBox>
            <Image src={user?.originalProfileImg || undefined} />
          </SideBox>
          <ContentsBox>
            <Name>{user?.name} 님</Name>
            <Email>{user?.email}</Email>
            <Address>
              {`(${user?.address.zonecode}) ${user?.address.address}`}
            </Address>
            <Box>
              <Role>
                {user?.role === UserRole.Client ? "고객님" : "사장님"}
              </Role>
            </Box>
          </ContentsBox>
        </ProfileBox>
      </Container>
    </>
  );
};

export const MyProfile: React.FC<MyProfileProp> = ({ user }) => {
  console.log(user);

  return (
    <>
      <Helmet>
        <title>{siteName} | 회원정보</title>
      </Helmet>
      <Container>
        <ProfileBox>
          <SideBox>
            <Image src={user?.originalProfileImg || undefined} />
          </SideBox>
          <ContentsBox>
            <Name>{user?.name} 님</Name>
            <Email>{user?.email}</Email>
            <Address>
              {`(${user?.address.zonecode}) ${user?.address.address}`}
            </Address>
            <Box>
              <Role>
                {user?.role === UserRole.Client ? "고객님" : "사장님"}
              </Role>
              <SLink to="/edit-profile">회원정보 변경하기</SLink>
            </Box>
          </ContentsBox>
        </ProfileBox>
      </Container>
    </>
  );
};
