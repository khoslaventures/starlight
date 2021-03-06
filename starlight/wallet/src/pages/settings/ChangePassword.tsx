import * as React from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { BtnSubmit } from 'pages/shared/Button'
import { RADICALRED } from 'pages/shared/Colors'
import { Heading } from 'pages/shared/Heading'
import { Icon } from 'pages/shared/Icon'
import { Input, Label } from 'pages/shared/Input'

import { config } from 'state/config'
import { flash } from 'state/flash'

const View = styled.div`
  padding: 25px;
`
const Form = styled.form`
  margin-top: 45px;
`

interface Props {
  editPassword: (params: { OldPassword: string; Password: string }) => any
  closeModal: () => void
  setFlash: (message: string) => void
}

interface State {
  OldPassword: string
  NewPassword: string
  showError: boolean
  loading: boolean
}

export class ChangePassword extends React.Component<Props, State> {
  public constructor(props: any) {
    super(props)

    this.state = {
      OldPassword: '',
      NewPassword: '',
      showError: false,
      loading: false,
    }

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  public render() {
    return (
      <View>
        <Heading>Change password</Heading>
        <Form onSubmit={this.handleSubmit}>
          <Label htmlFor="OldPassword">Current Password</Label>
          <Input
            type="password"
            name="OldPassword"
            autoComplete="off"
            autoFocus
            onChange={e => {
              this.setState({ OldPassword: e.target.value })
            }}
          />
          <Label htmlFor="NewPassword">New Password</Label>
          <Input
            type="password"
            name="NewPassword"
            autoComplete="off"
            onChange={e => {
              this.setState({ NewPassword: e.target.value })
            }}
          />

          {this.formatSubmitButton()}
        </Form>
      </View>
    )
  }

  private formatSubmitButton() {
    if (this.state.loading) {
      return (
        <BtnSubmit disabled>
          Saving <Icon className="fa-pulse" name="spinner" />
        </BtnSubmit>
      )
    } else if (this.state.showError) {
      return (
        <BtnSubmit color={RADICALRED} disabled>
          Error changing password
        </BtnSubmit>
      )
    } else {
      return <BtnSubmit>Save</BtnSubmit>
    }
  }

  private async handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    this.setState({ loading: true })

    const ok = await this.props.editPassword({
      OldPassword: this.state.OldPassword,
      Password: this.state.NewPassword,
    })

    if (ok) {
      this.props.closeModal()
      this.props.setFlash('Your password has been changed')
    } else {
      this.setState({ loading: false, showError: true })
      window.setTimeout(() => {
        this.setState({ showError: false })
      }, 3000)
    }
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    editPassword: (params: { OldPassword: string; Password: string }) => {
      return config.edit(dispatch, params)
    },
    setFlash: (message: string) => {
      return flash.set(dispatch, message)
    },
  }
}

export const ConnectedChangePassword = connect<
  {},
  {},
  {
    closeModal: () => void
  }
>(
  null,
  mapDispatchToProps
)(ChangePassword)
