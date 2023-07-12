import { InjectionProvider } from "../impact-app-test";
import { Firebase } from "./Firebase";
import { Authenticator } from "./Authenticator";

export const GlobalServicesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <InjectionProvider classes={[Firebase, Authenticator]}>
      {children}
    </InjectionProvider>
  );
};
