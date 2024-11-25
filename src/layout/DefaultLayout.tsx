import {defaultLayoutProps} from "../types/Types.tsx"

export const DefaultLayout = ({children}: defaultLayoutProps ) => {
  
  return (
      <main>
        {children}
      </main>
  );
};

export default DefaultLayout;
