import { User } from "firebase/auth";
import { InjectionProvider } from "../impact-app-test";
import { Session } from "./Session";

export const ServicesProvider = ({
  user,
  children,
}: {
  user: User;
  children: React.ReactNode;
}) => {
  return (
    <InjectionProvider classes={[Session]} values={[["user", user]]}>
      {children}
    </InjectionProvider>
  );
};
