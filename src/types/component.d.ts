export type DynamicAsProp<T extends React.ElementType> = {
  as?: T;
};

export type DynamicComponentProps<
  T extends React.ElementType,
  ExtraProps = unknown,
> = DynamicAsProp<T> &
  Omit<React.ComponentPropsWithRef<T>, "as" | keyof ExtraProps> &
  ExtraProps;

export type DynamicComponent<
  DefaultComponent extends React.ElementType,
  ExtraProps = unknown,
> = <T extends React.ElementType = DefaultComponent>(
  props: DynamicComponentProps<T, ExtraProps> & {
    ref?: React.Ref<Element>;
  },
) => React.ReactElement | null;

export type ForwardedRefDynamicComponent<
  DefaultComponent extends React.ElementType,
  ExtraProps = unknown,
> = <T extends React.ElementType = DefaultComponent>(
  props: DynamicComponentProps<T, ExtraProps>,
  ref?: React.Ref<Element>,
) => React.ReactElement | null;
