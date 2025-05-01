export type RootStackParamList = {
  Regist: undefined;
  Info: undefined;
  Time: undefined;
  GoalsScreen: undefined;
  BodyAreas: { selectedGoals: string[] };
  Motivation: { selectedGoals: string[] };
  Loading: { selectedGoals: string[]; selectedMotivations: string[] };
  GoalFormation: undefined;
  Skill: undefined;
  Flexibility: undefined;
  Endurance: undefined;
  Breath: undefined;  
  Restrictions: undefined;
  Notification: undefined;
  // Добавьте другие экраны по мере необходимости
};